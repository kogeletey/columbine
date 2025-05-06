package ru.dima.secondseminar.controllers;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import ru.dima.secondseminar.dto.TransactionAnalysisDTO;

@RestController
@RequestMapping("/api/v1")
public class TransactionAnalysisController {
    private final WebClient analyticServiceClient;

    public TransactionAnalysisController(@Qualifier("anltcService") WebClient analyticServiceClient) {
        this.analyticServiceClient = analyticServiceClient;
    }

    @GetMapping("/{transactionHash}")
    public TransactionAnalysisDTO getTransactionInfo(@PathVariable("transactionHash") String transactionHash) {
        return analyticServiceClient
                .get()
                .uri(uriBuilder -> uriBuilder.path("/" + transactionHash).build())
                .retrieve()
                .bodyToMono(TransactionAnalysisDTO.class)
                .block();
    }
}
