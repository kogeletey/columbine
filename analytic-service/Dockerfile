# Use a newer Gradle version that supports Java 21
FROM gradle:8.4-jdk17-alpine AS builder

WORKDIR /app
COPY . .

# Disable build cache and instrumentation to avoid the ASM issue
RUN gradle --no-daemon --no-build-cache -Dorg.gradle.instrumentation.enabled=false clean build bootJar

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]