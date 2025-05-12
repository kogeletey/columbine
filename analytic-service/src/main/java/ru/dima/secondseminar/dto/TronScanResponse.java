package ru.dima.secondseminar.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class TronScanResponse {
    private String type;
    private int count;
    private Status status;
    private List<DataEntry> data;

    @Data
    public static class Status {
        private int code;
        private String message;
    }

    @Data
    public static class DataEntry {
        private String address;
        private long balance;

        @JsonProperty("verify_status")
        private int verifyStatus;

        @JsonProperty("is_proxy")
        private boolean isProxy;

        @JsonProperty("proxy_implementation")
        private String proxyImplementation;

        @JsonProperty("old_proxy_implementation")
        private String oldProxyImplementation;

        private int balanceInUsd;
        private long trxCount;

        @JsonProperty("date_created")
        private long dateCreated;

        @JsonProperty("call_value")
        private long callValue;

        @JsonProperty("call_token_value")
        private int callTokenValue;

        @JsonProperty("call_token_id")
        private int callTokenId;

        @JsonProperty("call_token_info")
        private CallTokenInfo callTokenInfo;

        private String name;
        private String description;
        private String tag1;

        @JsonProperty("tag1Url")
        private String tag1Url;

        private boolean vip;
        private boolean feedbackRisk;
        private String announcement;
        private String license;

        @JsonProperty("blueTag")
        private String blueTag;

        @JsonProperty("blueTagUrl")
        private String blueTagUrl;

        @JsonProperty("greyTag")
        private String greyTag;

        @JsonProperty("redTag")
        private String redTag;

        @JsonProperty("publicTag")
        private String publicTag;

        @JsonProperty("publicTagDesc")
        private String publicTagDesc;

        private Creator creator;
        private String auditReportUrl;
        private String auditDep;
        private String auditDate;
        private Map<String, String> methodMap;

        @JsonProperty("energy_factor")
        private double energyFactor;

        private TokenInfo tokenInfo;
        private BigDecimal balanceWithTokens;

        @JsonProperty("balanceWithTokensInUsd")
        private BigDecimal balanceWithTokensInUsd;
    }

    @Data
    public static class CallTokenInfo {
        private TokenInfo tokenInfo;
    }

    @Data
    public static class TokenInfo {
        private String tokenId;
        private String tokenAbbr;
        private String tokenName;
        private int tokenDecimal;
        private int tokenCanShow;
        private String tokenType;
        private String tokenLogo;
        private String tokenLevel;
        private Boolean vip;
        private String issuerAddr;
    }

    @Data
    public static class Creator {
        private String address;

        @JsonProperty("address_is_contract")
        private boolean addressIsContract;

        private String txHash;

        @JsonProperty("token_balance")
        private long tokenBalance;

        @JsonProperty("consume_user_resource_percent")
        private int consumeUserResourcePercent;

        @JsonProperty("energy_remaining")
        private int energyRemaining;

        @JsonProperty("energy_limit")
        private int energyLimit;
    }
}