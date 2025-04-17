package ru.dima.secondseminar.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Message {
    private String content;

    public String getContent() {
        return content;
    }
}
