package com.example.writer.app;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {
        // Build the prompt
        String prompt = buildPrompt(emailRequest);

        // Craft a request
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        // Do request and get response
        // Ensure the API key is passed as a query parameter, not as part of the path
        String response = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extract Response and Return
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            return "Error processing request: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        String tone = emailRequest.getTone() != null ? emailRequest.getTone().toLowerCase() : "professional";
        switch (tone) {
            case "friendly":
                prompt.append("Generate a short, friendly and relevant email reply for the following email content. Please do not generate a subject line. Avoid extra options or unnecessary details.\n");
                break;
            case "funny":
                prompt.append("Generate a brief, light-hearted and funny email reply for the following email content. Please do not generate a subject line. Avoid extra options or unnecessary details.\n");
                break;
            case "professional":
            default:
                prompt.append("Generate a concise and professional email reply for the following email content. Please do not generate a subject line.\n");
                break;
        }
        prompt.append("Original email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}