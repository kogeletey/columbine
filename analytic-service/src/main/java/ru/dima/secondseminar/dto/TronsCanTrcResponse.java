package ru.dima.secondseminar.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class TronsCanTrcResponse {
    private String total;
    private Map<String, Boolean> contractMap;
    private String rangeTotal;
    private List<Trc20Token> trc20_tokens;

    @Data
    public static class Trc20Token {
        private String issue_ts;
        private String symbol;
        private String redTag;
        private String token_desc;
        private String price_trx;
        private boolean fromThirdParty;
        private String price;
        private boolean vip;
        private String announcement;
        private String icon_url;
        private String level;
        private String volume24h;
        private String index;
        private String market_cap_usd;
        private String transfer24h_rate;
        private MarketInfo market_info;
        private String volume;
        private String thirdPartyUrl;
        private String liquidity24h;
        private String name;
        private String tokenType;
        private String social_media;
        private String totalTurnOver;
        private String greyTag;
        private String contract_address;
        private String publicTag;
        private String gain;
        private String home_page;
        private boolean StringvcToken;
        private String justSwapVolume24h;
        private String git_hub;
        private String total_supply_with_decimals;
        private String transfer24h;
        private List<SocialMedia> social_media_list;
        private String justSwapVolume24h_rate;
        private String volume24h_rate;
        private String email;
        private String liquidity24h_rate;
        private String total_supply;
        private String date_created;
        private String total_supply_str;
        private boolean symbolShow;
        private String contract_name;
        private String blueTag;
        private String issue_address;
        private String transfer_num;
        private String holders_count;
        private TokenPriceLine tokenPriceLine;
        private String decimals;
        private String issue_time;
        private String white_paper;

        @Data
        public static class MarketInfo {
            private String fPrecision;
            private String fShortName;
            private String fTokenAddr;
            private boolean filter;
            private String gain;
            private String liquidity;
            private String pairUrl;
            private String priceFrom;
            private String priceStringrx;
            private String priceInUsd;
            private String sPrecision;
            private String sShortName;
            private String volume24hGain;
            private String volume24hStringrx;
        }

        @Data
        public static class SocialMedia {
            private String name;
            private String url;
        }

        @Data
        public static class TokenPriceLine {
            private String total;
            private List<PriceData> data;

            @Data
            public static class PriceData {
                private String priceUsd;
                private String time;
            }
        }
    }
}