package ru.dima.secondseminar.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.dima.secondseminar.config.MyTelegramBot;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tg")
public class TelegramBot {

    private final MyTelegramBot bot;

    @PostMapping("/{message}")
    public ResponseEntity<String> getMessage(@PathVariable String message) {
        return ResponseEntity.ok(bot.callDeepSeek(message));
    }
}
