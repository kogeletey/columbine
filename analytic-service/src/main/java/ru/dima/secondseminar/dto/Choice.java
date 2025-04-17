package ru.dima.secondseminar.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Choice {
    private Message message;

    public Message getMessage() {
        return message;
    }
}