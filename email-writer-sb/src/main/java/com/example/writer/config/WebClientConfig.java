package com.example.writer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    // This bean is used to create a WebClient instance which can be injected into services
    // The WebClient.Builder allows for customization of the WebClient, such as adding interceptors, codecs, etc.
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
