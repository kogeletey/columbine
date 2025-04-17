package ru.dima.secondseminar.config;

import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import ru.dima.secondseminar.dto.DeepSeekResponse;
import ru.dima.secondseminar.dto.MessageDto;
import ru.dima.secondseminar.dto.TelegramDTO;

@Component
public class MyTelegramBot extends TelegramLongPollingBot {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.bot.username}")
    private String botUsername;

    @Value("${deepseek.api.token}")
    private String deepSeekToken;

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
        if (update.hasMessage() && update.getMessage().hasText()) {
            String chatId = update.getMessage().getChatId().toString();
            String userMessage = update.getMessage().getText();

            String response = callDeepSeek(userMessage);

            sendMessage(chatId, response);
        }
    }

    private void sendMessage(String chatId, String text) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(text);
        try {
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    public String callDeepSeek(String userMessage) {
        String apiUrl = "https://openrouter.ai/api/v1/chat/completions";

        TelegramDTO dto = new TelegramDTO("deepseek/deepseek-chat:free", List.of(new MessageDto("user", userMessage)));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(deepSeekToken);

        HttpEntity request = new HttpEntity(dto, headers);
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.postForObject(apiUrl, request, String.class);

        try {
            DeepSeekResponse deepSeekResponse = objectMapper.readValue(response, DeepSeekResponse.class);

            return deepSeekResponse.getChoices().get(0).getMessage().getContent();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error fetching response";
        }
    }
}
