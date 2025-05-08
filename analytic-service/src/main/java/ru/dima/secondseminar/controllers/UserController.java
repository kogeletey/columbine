package ru.dima.secondseminar.controllers;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.dima.secondseminar.dto.RequestDTO;
import ru.dima.secondseminar.dto.TokenStatsDTO;
import ru.dima.secondseminar.dto.TransactionAnalysisDTO;
import ru.dima.secondseminar.entities.User;
import ru.dima.secondseminar.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/history")
    public ResponseEntity<?> getUserHistory(
            @RequestParam(required = false) String telegramId,
            @RequestParam(required = false) String walletAddress) {

        if ((telegramId == null || telegramId.isEmpty()) &&
                (walletAddress == null || walletAddress.isEmpty())) {
            return ResponseEntity.badRequest()
                                 .body("At least one of telegramId or walletAddress must be provided");
        }

        List<RequestDTO> history = userService.getUserHistory(telegramId, walletAddress);
        return ResponseEntity.ok(history);
    }

    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestParam String name,
            @RequestParam(required = false) String telegramId,
            @RequestParam(required = false) String walletAddress) {

        if ((telegramId == null || telegramId.isEmpty()) &&
                (walletAddress == null || walletAddress.isEmpty())) {
            return ResponseEntity.badRequest()
                                 .body("At least one of telegramId or walletAddress must be provided");
        }

        userService.createNewUser(name, telegramId, walletAddress);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<?> mergeUser(
            @RequestParam String name,
            @RequestParam(required = false) String telegramId,
            @RequestParam(required = false) String walletAddress) {

        if (telegramId == null && telegramId.isEmpty() && walletAddress == null && walletAddress.isEmpty()) {
            return ResponseEntity.badRequest()
                                 .body("telegramId and walletAddress must be provided");
        }

        userService.mergeUser(name, telegramId, walletAddress);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/requests")
    public ResponseEntity<Void> saveUserRequest(
            @PathVariable Long userId,
            @RequestBody TokenStatsDTO addressResult,
            @RequestBody TransactionAnalysisDTO transactionResult) {
        userService.saveUserRequest(userId, addressResult, transactionResult);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteUser(
            @RequestParam(required = false) String telegramId,
            @RequestParam(required = false) String walletAddress) {

        if ((telegramId == null || telegramId.isEmpty()) &&
                (walletAddress == null || walletAddress.isEmpty())) {
            return ResponseEntity.badRequest()
                                 .body("At least one of telegramId or walletAddress must be provided");
        }

        userService.deleteUser(telegramId, walletAddress);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getUserId")
    public ResponseEntity<?> getUserId(
            @RequestParam(required = false) String telegramId,
            @RequestParam(required = false) String walletAddress) {

        if ((telegramId == null || telegramId.isEmpty()) &&
                (walletAddress == null || walletAddress.isEmpty())) {
            return ResponseEntity.badRequest()
                                 .body("At least one of telegramId or walletAddress must be provided");
        }

        Optional<User> user = userService.findUser(telegramId, walletAddress);

        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }
}