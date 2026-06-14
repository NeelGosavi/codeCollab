# Use Eclipse Temurin Java 21
FROM eclipse-temurin:21-jdk-alpine

# Install Python and Node.js for code execution feature
RUN apk add --no-cache \
    python3 \
    py3-pip \
    nodejs \
    npm \
    curl

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application with debug info
RUN ./mvnw clean package -DskipTests -X && \
    mv target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application with debug logging
ENTRYPOINT ["java", "-jar", "-Dserver.port=8080", "-Dserver.address=0.0.0.0", "-Ddebug", "app.jar"]