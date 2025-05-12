package ru.dima.secondseminar.telegramBot;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import ru.dima.secondseminar.controllers.ContractAnalyticsController;
import ru.dima.secondseminar.dto.RequestDTO;
import ru.dima.secondseminar.dto.TokenStatsDTO;
import ru.dima.secondseminar.dto.TransactionAnalysisDTO;
import ru.dima.secondseminar.entities.User;
import ru.dima.secondseminar.service.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ColumineTelegramBot extends TelegramLongPollingBot {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.bot.username}")
    private String botUsername;

    private final ContractAnalyticsController contractApi;
    private final UserService userService;

    private enum BotState {
        MAIN_MENU,
        AWAITING_CONTRACT_ADDRESS,
        AWAITING_TRANSACTION_HASH,
        AWAITING_NAME_FOR_REGISTRATION
    }

    private BotState currentState = BotState.MAIN_MENU;
    private String pendingContractAddress;
    private String pendingTransactionHash;

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) {
            return;
        }

        long chatId = update.getMessage().getChatId();
        String messageText = update.getMessage().getText();
        String telegramUsername = update.getMessage().getFrom().getUserName();

        try {
            Optional<User> user = userService.findUser(telegramUsername, null);

            if (user.isEmpty() && currentState != BotState.AWAITING_NAME_FOR_REGISTRATION) {
                promptForRegistration(chatId);
                return;
            }

            processUpdate(chatId, messageText, telegramUsername);
        } catch (Exception e) {
            sendErrorMessage(chatId, "❌ Error: " + e.getMessage());
        }
    }

    private void processUpdate(long chatId, String messageText, String telegramUsername) throws TelegramApiException {
        switch (currentState) {
            case MAIN_MENU -> handleMainMenu(chatId, messageText, telegramUsername);
            case AWAITING_CONTRACT_ADDRESS -> handleContractAddressInput(chatId, messageText, telegramUsername);
            case AWAITING_TRANSACTION_HASH -> handleTransactionHashInput(chatId, messageText, telegramUsername);
            case AWAITING_NAME_FOR_REGISTRATION -> handleUserRegistration(chatId, messageText, telegramUsername);
        }
    }

    private void handleMainMenu(long chatId, String messageText, String telegramUsername) throws TelegramApiException {
        switch (messageText) {
            case "/start" -> sendWelcomeMessage(chatId);
            case "Get Tron Token Info" -> requestContractAddress(chatId);
            case "Analyze Transaction" -> requestTransactionHash(chatId);
            case "My History" -> displayUserHistory(chatId, telegramUsername);
            default -> sendUnknownCommandMessage(chatId);
        }
    }

    private void promptForRegistration(long chatId) throws TelegramApiException {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText("👋 Welcome to Columine Bot!\n\n" +
                                "Please enter your name to complete registration:");

        currentState = BotState.AWAITING_NAME_FOR_REGISTRATION;
        execute(message);
    }

    private void handleUserRegistration(long chatId, String name, String telegramUsername) throws TelegramApiException {
        try {
            userService.createNewUser(name, telegramUsername, null);
            sendResponseWithMenu(chatId, "✅ Registration successful! Welcome, " + name + "!");
            currentState = BotState.MAIN_MENU;
        } catch (IllegalArgumentException e) {
            sendErrorMessage(chatId, e.getMessage());
            promptForRegistration(chatId);
        }
    }

    private void requestContractAddress(long chatId) throws TelegramApiException {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText("📝 Please enter the TRON contract address:");
        message.setReplyMarkup(createBackToMenuKeyboard());

        execute(message);
        currentState = BotState.AWAITING_CONTRACT_ADDRESS;
    }

    private void requestTransactionHash(long chatId) throws TelegramApiException {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText("📝 Please enter the transaction hash to analyze:");
        message.setReplyMarkup(createBackToMenuKeyboard());

        execute(message);
        currentState = BotState.AWAITING_TRANSACTION_HASH;
    }

    private void handleContractAddressInput(long chatId, String contractAddress, String telegramUsername)
            throws TelegramApiException {
        if ("Back to Menu".equalsIgnoreCase(contractAddress)) {
            returnToMainMenu(chatId);
            return;
        }

        try {
            TokenStatsDTO tokenStats = contractApi.getMainInfo(contractAddress);
            String response = formatTokenStatsResponse(contractAddress, tokenStats);

            // Save to user history
            User user = userService.findUser(telegramUsername, null)
                                   .orElseThrow(() -> new IllegalArgumentException("User not found"));
            userService.saveUserRequest(user.getId(), tokenStats, new TransactionAnalysisDTO());

            sendResponseWithMenu(chatId, response);
        } catch (Exception e) {
            sendErrorMessage(chatId, "Error processing contract: " + e.getMessage());
            requestContractAddress(chatId);
        }
    }

    private void handleTransactionHashInput(long chatId, String transactionHash, String telegramUsername)
            throws TelegramApiException {
        if ("Back to Menu".equalsIgnoreCase(transactionHash)) {
            returnToMainMenu(chatId);
            return;
        }

        try {
            TransactionAnalysisDTO analysis = contractApi.getTransactionInfo(transactionHash);
            String response = formatTransactionAnalysisResponse(analysis);

            // Save to user history
            User user = userService.findUser(telegramUsername, null)
                                   .orElseThrow(() -> new IllegalArgumentException("User not found"));
            userService.saveUserRequest(user.getId(), new TokenStatsDTO(), analysis);

            splitAndSendMessage(chatId, response);
        } catch (Exception e) {
            sendErrorMessage(chatId, "Error analyzing transaction: " + e.getMessage());
            requestTransactionHash(chatId);
        }
    }

    private void displayUserHistory(long chatId, String telegramUsername) throws TelegramApiException {
        try {
            List<RequestDTO> history = userService.getUserHistory(telegramUsername, null);

            if (history.isEmpty()) {
                sendResponseWithMenu(chatId, "📭 You don't have any saved requests yet.");
                return;
            }

            StringBuilder response = new StringBuilder("📜 Your Request History:\n\n");
            for (RequestDTO request : history) {
                response.append("🔹 ").append(request.getAddress() != null ?
                                                     "Contract: " + request.getAddress() :
                                                     "TX: " + request.getHash())
                        .append("\n");
                if (request.getTransactionResult() != null && request.getTransactionResult().getTimestamp() != null) {
                    response.append("   ⏱ ").append(request.getTransactionResult().getTimestamp()).append("\n");
                }
                response.append("\n");
            }

            splitAndSendMessage(chatId, response.toString());
        } catch (Exception e) {
            sendErrorMessage(chatId, "Error retrieving history: " + e.getMessage());
        }
    }

    private String formatTokenStatsResponse(String contractAddress, TokenStatsDTO tokenStats) {
        return TokenStatsDTO.createPrettyResponse(contractAddress, tokenStats);
    }

    private String formatTransactionAnalysisResponse(TransactionAnalysisDTO analysis) {
        StringBuilder sb = new StringBuilder();

        sb.append("🔍 *Transaction Analysis*\n\n");
        sb.append("🆔 *Hash:* `").append(escapeMarkdown(analysis.getTransactionHash())).append("`\n");
        sb.append("⏱ *Timestamp:* ").append(analysis.getTimestamp() != null ?
                                                    escapeMarkdown(analysis.getTimestamp()) : "N/A").append("\n");
        sb.append("🧱 *Block:* ").append(analysis.getBlockNumber() != null ?
                                                escapeMarkdown(analysis.getBlockNumber()) : "N/A").append("\n\n");

        TransactionAnalysisDTO.Analysis analysisData = analysis.getAnalysis();
        if (analysisData.getType().equals("SIMPLE")) {
            sb.append("📊 *Analysis*\n");
            sb.append("\n");
            sb.append("Message: " + analysisData.getMessage() + "\n");
            sb.append("\n");
            sb.append("Possible transaction types: " + String.join(", ", analysisData.getPossibleTypes()) + "\n");
        }
        sb.append("📊 *Analysis*\n");
        sb.append("┣ *Type:* ").append(analysisData.getType() != null ?
                                               escapeMarkdown(analysisData.getType()) : "N/A").append("\n");
        sb.append("┗ *Main Contract:* ").append(analysisData.getMainContract() != null ?
                                                        "`" + escapeMarkdown(analysisData.getMainContract()) + "`" : "N/A").append("\n\n");

        if (analysisData.getCallHierarchy() != null && !analysisData.getCallHierarchy().isEmpty()) {
            sb.append("🌳 *Call Hierarchy*\n");
            analysisData.getCallHierarchy().forEach((hash, node) -> {
                sb.append("┣─ ").append(node.getNote() != null ? escapeMarkdown(node.getNote()) : "call")
                  .append(" [").append(hash != null ? escapeMarkdown(hash.substring(0, 8)) : "null").append("...]\n");
                sb.append("┃  ├─ Caller: ").append(node.getCaller() != null ?
                                                           "`" + escapeMarkdown(node.getCaller()) + "`" : "N/A").append("\n");
                sb.append("┃  ├─ Callee: ").append(node.getCallee() != null ?
                                                           "`" + escapeMarkdown(node.getCallee()) + "`" : "N/A").append("\n");
                sb.append("┃  └─ Value: ").append(node.getValue() != null ?
                                                          escapeMarkdown(node.getValue()) : "0").append("\n");

                if (node.getChildren() != null && !node.getChildren().isEmpty()) {
                    sb.append("┃     └─ Children:\n");
                    node.getChildren().forEach(child -> {
                        sb.append("┃        ├─ ").append(child.getNote() != null ?
                                                                 escapeMarkdown(child.getNote()) : "call").append(" [")
                          .append(child.getHash() != null ? escapeMarkdown(child.getHash().substring(0, 8)) : "null")
                          .append("...]\n");
                        sb.append("┃        │  ├─ Caller: ").append(child.getCaller() != null ?
                                                                            "`" + escapeMarkdown(child.getCaller()) + "`" : "N/A").append("\n");
                        sb.append("┃        │  ├─ Callee: ").append(child.getCallee() != null ?
                                                                            "`" + escapeMarkdown(child.getCallee()) + "`" : "N/A").append("\n");
                        sb.append("┃        │  └─ Value: ").append(child.getValue() != null ?
                                                                           escapeMarkdown(child.getValue()) : "0").append("\n");
                    });
                }
            });
            sb.append("\n");
        } else {
            sb.append("🌳 *Call Hierarchy:* No call data available\n\n");
        }

        // Event Logs - only if not null
        if (analysisData.getEventLogs() != null && !analysisData.getEventLogs().isEmpty()) {
            sb.append("📜 *Event Logs*\n");
            analysisData.getEventLogs().forEach(log -> {
                sb.append("┣─ ").append(log.getEventType() != null ?
                                                escapeMarkdown(log.getEventType()) : "unknown").append(" @ ")
                  .append(log.getContract() != null ? "`" + escapeMarkdown(log.getContract()) + "`" : "N/A").append("\n");

                if (log.getEvent() != null) {
                    sb.append("┃  ├─ Event: ").append(escapeMarkdown(log.getEvent())).append("\n");
                }
                if (log.getFrom() != null || log.getTo() != null) {
                    sb.append("┃  ├─ From: ").append(log.getFrom() != null ?
                                                             "`" + escapeMarkdown(log.getFrom()) + "`" : "N/A").append("\n");
                    sb.append("┃  ├─ To: ").append(log.getTo() != null ?
                                                           "`" + escapeMarkdown(log.getTo()) + "`" : "N/A").append("\n");
                }
                if (log.getSender() != null) {
                    sb.append("┃  ├─ Sender: ").append("`" + escapeMarkdown(log.getSender()) + "`").append("\n");
                }

                // Handle value/amounts
                if (log.getValue() != null) {
                    sb.append("┃  ├─ Value:\n");
                    sb.append("┃  │  ├─ Raw: ").append(log.getValue().getRaw() != null ?
                                                               escapeMarkdown(log.getValue().getRaw()) : "N/A").append("\n");
                    sb.append("┃  │  └─ TRX: ").append(log.getValue().getTrx() != null ?
                                                               escapeMarkdown(log.getValue().getTrx()) : "N/A").append("\n");
                }

                // Handle swap amounts
                if (log.getAmount0In() != null || log.getAmount1In() != null ||
                        log.getAmount0Out() != null || log.getAmount1Out() != null) {
                    sb.append("┃  ├─ Swap Details:\n");
                    appendAmount(sb, "Amount0 In", log.getAmount0In());
                    appendAmount(sb, "Amount1 In", log.getAmount1In());
                    appendAmount(sb, "Amount0 Out", log.getAmount0Out());
                    appendAmount(sb, "Amount1 Out", log.getAmount1Out());
                }

                if (log.getRawData() != null) {
                    sb.append("┃  └─ Raw Data: ").append(escapeMarkdown(
                            log.getRawData().substring(0, Math.min(20, log.getRawData().length()))));
                    sb.append("...\n");
                } else {
                    sb.append("┃\n");
                }
            });
        } else {
            sb.append("📜 *Event Logs:* No event logs available\n");
        }

        return sb.toString();
    }

    private void appendAmount(StringBuilder sb, String label, Object amount) {
        if (amount != null) {
            sb.append("┃  │  ├─ ").append(escapeMarkdown(label)).append(": ");
            if (amount instanceof Number) {
                sb.append(amount);
            } else if (amount instanceof TransactionAnalysisDTO.Amount) {
                TransactionAnalysisDTO.Amount amt = (TransactionAnalysisDTO.Amount) amount;
                sb.append("\n");
                sb.append("┃  │  │  ├─ Raw: ").append(amt.getRaw()).append("\n");
                sb.append("┃  │  │  └─ TRX: ").append(amt.getTrx() != null ? amt.getTrx() : "N/A");
            }
            sb.append("\n");
        }
    }

    private String escapeMarkdown(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("*", "\\*")
                   .replace("_", "\\_")
                   .replace("`", "\\`")
                   .replace("[", "\\[");
    }

    // Overload for numbers
    private String escapeMarkdown(Number number) {
        return escapeMarkdown(number.toString());
    }

    private void splitAndSendMessage(long chatId, String text) throws TelegramApiException {
        int maxLength = 4000;
        if (text.length() <= maxLength) {
            sendResponseWithMenu(chatId, text);
            return;
        }

        // Split the message into parts
        for (int i = 0; i < text.length(); i += maxLength) {
            String part = text.substring(i, Math.min(text.length(), i + maxLength));
            if (i + maxLength >= text.length()) {
                sendResponseWithMenu(chatId, part);
            } else {
                sendPlainMessage(chatId, part);
            }
        }
    }

    private void sendPlainMessage(long chatId, String text) throws TelegramApiException {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(text);
        execute(message);
    }

    private void sendResponseWithMenu(long chatId, String text) throws TelegramApiException {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(text);
        message.setReplyMarkup(createMainMenuKeyboard());
        execute(message);
        currentState = BotState.MAIN_MENU;
    }

    private void returnToMainMenu(long chatId) throws TelegramApiException {
        sendWelcomeMessage(chatId);
    }

    private void sendWelcomeMessage(long chatId) throws TelegramApiException {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText("🤖 Welcome to Columine Bot!\n\n" +
                                "Choose an option from the menu below:");
        message.setReplyMarkup(createMainMenuKeyboard());
        execute(message);
        currentState = BotState.MAIN_MENU;
    }

    private void sendUnknownCommandMessage(long chatId) throws TelegramApiException {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText("⚠️ Unknown command. Please use the menu buttons.");
        message.setReplyMarkup(createMainMenuKeyboard());
        execute(message);
    }

    private void sendErrorMessage(long chatId, String errorMessage) {
        try {
            SendMessage message = new SendMessage();
            message.setChatId(String.valueOf(chatId));
            message.setText("❌ " + errorMessage);
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    private ReplyKeyboardMarkup createMainMenuKeyboard() {
        ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
        keyboardMarkup.setResizeKeyboard(true);
        keyboardMarkup.setOneTimeKeyboard(false);

        List<KeyboardRow> keyboard = new ArrayList<>();

        KeyboardRow row1 = new KeyboardRow();
        row1.add(new KeyboardButton("Get Tron Token Info"));
        row1.add(new KeyboardButton("Analyze Transaction"));

        KeyboardRow row2 = new KeyboardRow();
        row2.add(new KeyboardButton("My History"));

        keyboard.add(row1);
        keyboard.add(row2);

        keyboardMarkup.setKeyboard(keyboard);
        return keyboardMarkup;
    }

    private ReplyKeyboardMarkup createBackToMenuKeyboard() {
        ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
        keyboardMarkup.setResizeKeyboard(true);
        keyboardMarkup.setOneTimeKeyboard(true);

        List<KeyboardRow> keyboard = new ArrayList<>();
        KeyboardRow row = new KeyboardRow();
        row.add(new KeyboardButton("Back to Menu"));
        keyboard.add(row);

        keyboardMarkup.setKeyboard(keyboard);
        return keyboardMarkup;
    }
}