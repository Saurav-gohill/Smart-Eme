FROM maven:3.8.4-openjdk-17-slim as build

# Set the working directory to /app
WORKDIR /app

#Copy the pom.xml file to the container
COPY pom.xml .
RUN mvn dependency:go-offline

#Copy the source code to the container
COPY src ./src
RUN mvn clean package -DskipTests

#use an official OpenJDK image to run the application
FROM openjdk:17-jdk-slim

# Set the working directory to /app
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/example-writer-sb-0.0.1-SNAPSHOT.jar .

# Expose port 8081
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "example-writer-sb-0.0.1-SNAPSHOT.jar"]