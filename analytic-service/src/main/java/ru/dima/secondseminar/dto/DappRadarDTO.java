package ru.dima.secondseminar.dto;


import lombok.Data;

@Data
public class DappRadarDTO {
    private boolean success;
    private String range;
    private Results results;

    @Data
    public static class Results {
        private String volume;
        private String marketCap;
        private double priceChange;
    }
}
