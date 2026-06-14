# Use Eclipse Temurin Java 21
FROM eclipse-temurin:21-jdk-alpine

# Install Python and Node.js for code execution
RUN apk add --no-cache \
    python3 \
    py3-pip \
    nodejs \
    npm \
    curl

WORKDIR /app

# Copy everything
COPY . .

# Make mvnw executable
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# List contents to verify JAR
RUN ls -la target/

# Rename JAR for easy execution
RUN cp target/*.jar app.jar

EXPOSE 8080

# Run with debug to see all endpoints
CMD ["java", "-jar", "-Dserver.port=8080", "-Dserver.address=0.0.0.0", "-Ddebug=true", "app.jar"]