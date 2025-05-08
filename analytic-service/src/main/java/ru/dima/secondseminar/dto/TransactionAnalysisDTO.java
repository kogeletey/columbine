package ru.dima.secondseminar.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class TransactionAnalysisDTO {
    private String transactionHash;
    private String timestamp;
    private String blockNumber;
    private Analysis analysis;

    @Data
    public static class Analysis {
        private String type;
        private String mainContract;
        private Map<String, CallNode> callHierarchy;
        private List<EventLog> eventLogs;
    }

    @Data
    public static class CallNode {
        private String hash;
        private String caller;
        private String callee;
        private String note;
        private String value;  // Note: In JSON it's a number, but you have it as String
        private List<CallNode> children;
    }

    @Data
    public static class EventLog {
        private String contract;
        private String eventType;
        private boolean decoded;
        private String signature;
        private String possibleEvent;
        private String event;
        private String from;
        private String to;
        private Value value;
        private String rawData;
        private List<String> rawTopics;
        private String sender;

        @JsonFormat(shape = JsonFormat.Shape.ANY)
        private Object amount0In;

        @JsonFormat(shape = JsonFormat.Shape.ANY)
        private Object amount1In;

        @JsonFormat(shape = JsonFormat.Shape.ANY)
        private Object amount0Out;

        @JsonFormat(shape = JsonFormat.Shape.ANY)
        private Object amount1Out;
    }

    @Data
    public static class Value {
        private String raw;
        private String formatted;
        private String trx;
    }

    @Data
    public static class Amount {
        private double raw;
        private String formatted;
        private String trx;
    }
}