package ru.dima.secondseminar.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestDTO {

    private Long id;

    private String hash;

    private String address;

    private TokenStatsDTO addressResult;

    private TransactionAnalysisDTO transactionResult;
}
