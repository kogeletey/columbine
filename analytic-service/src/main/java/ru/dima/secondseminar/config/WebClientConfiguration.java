package ru.dima.secondseminar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfiguration {

    @Bean(name = "tronscan")
    public WebClient setWebClient() {
        return WebClient.builder()
                        .baseUrl("https://apilist.tronscanapi.com/api")
                        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .defaultHeader("x-api-key", "1a92ee63-745f-48f1-bd88-34152ce7365b")
                        .build();
    }

    @Bean(name = "dappRadar")
    public WebClient setDappRadarWebClient() {
        return WebClient.builder()
                        .baseUrl("https://apis.dappradar.com/v2/tokens/metrics/")
                        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .defaultHeader("X-API-KEY", "W9eVJ0PNJ44PPOzxLCPKU6ukYO1vqGhD7nPquqDy")
                        .build();
    }

    @Bean(name = "anltcService")
    public WebClient setAnalyticServiceWebClient() {
        return WebClient.builder()
                .baseUrl("http://tron-analyzer:3000/api/analyze-transaction/")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}