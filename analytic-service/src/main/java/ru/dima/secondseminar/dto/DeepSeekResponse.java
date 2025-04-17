package ru.dima.secondseminar.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeepSeekResponse {
    private String id;
    private String provider;
    private String model;
    private String object;
    private long created;
    private List<Choice> choices;
}
