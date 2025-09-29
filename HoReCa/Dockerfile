# Use Java 21 runtime
FROM eclipse-temurin:21-jdk-alpine

# Set work directory
WORKDIR /app

# Copy the built jar
COPY target/HoReCa-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the Spring Boot app
ENTRYPOINT ["java","-jar","app.jar"]
