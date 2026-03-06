# Multi-stage build for Spring Boot (Java 17)

FROM eclipse-temurin:17-jdk AS build
WORKDIR /workspace

# Copy Maven wrapper + pom first for better layer caching
COPY mvnw pom.xml ./
COPY .mvn ./.mvn

# Download dependencies (cacheable)
RUN sh mvnw -q -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN sh mvnw -q -DskipTests package


FROM eclipse-temurin:17-jre
WORKDIR /app

# Render sets PORT; app reads it via server.port=${PORT:8080}
ENV PORT=8080

COPY --from=build /workspace/target/fedf-backend-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080
CMD ["java", "-jar", "/app/app.jar"]
