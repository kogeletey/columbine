package ru.dima.secondseminar.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import ru.dima.secondseminar.dto.TokenStatsDTO;

@Converter
public class TokenStatsDTOConverter implements AttributeConverter<TokenStatsDTO, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(TokenStatsDTO attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting TokenStatsDTO to JSON", e);
        }
    }

    @Override
    public TokenStatsDTO convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, TokenStatsDTO.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON to TokenStatsDTO", e);
        }
    }
}
