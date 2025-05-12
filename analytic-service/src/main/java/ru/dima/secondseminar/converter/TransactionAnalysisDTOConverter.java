package ru.dima.secondseminar.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import ru.dima.secondseminar.dto.TransactionAnalysisDTO;

@Converter
public class TransactionAnalysisDTOConverter implements AttributeConverter<TransactionAnalysisDTO, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(TransactionAnalysisDTO attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting TransactionAnalysisDTO to JSON", e);
        }
    }

    @Override
    public TransactionAnalysisDTO convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, TransactionAnalysisDTO.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON to TransactionAnalysisDTO", e);
        }
    }
}
