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

# Copy Maven files first (for better caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Debug: List target directory
RUN echo "=== Target directory contents ===" && \
    ls -la target/ && \
    echo "=== Finding JAR file ===" && \
    find target -name "*.jar"

# Copy the JAR file (handle different possible names)
RUN if [ -f target/*.jar ]; then \
        cp target/*.jar app.jar; \
    else \
        echo "ERROR: No JAR file found!" && exit 1; \
    fi

EXPOSE 8080

# Run the application
CMD ["java", "-jar", "-Dserver.port=8080", "-Dserver.address=0.0.0.0", "app.jar"]