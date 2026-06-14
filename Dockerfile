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

# Copy Maven wrapper and pom.xml first (for better caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies (this layer is cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the application - use the actual JAR name with wildcard
ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=8080 target/*.jar"]