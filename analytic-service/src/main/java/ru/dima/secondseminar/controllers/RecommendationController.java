package ru.dima.secondseminar.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.dima.secondseminar.entities.MasterClass;
import ru.dima.secondseminar.entities.User;
import ru.dima.secondseminar.repositories.ChefRepository;
import ru.dima.secondseminar.repositories.MasterclassRepository;
import ru.dima.secondseminar.repositories.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final MasterclassRepository masterclassRepository;
    private final UserRepository userRepository;
    private final ChefRepository chefRepository;

    public RecommendationController(MasterclassRepository masterclassRepository, UserRepository userRepository, ChefRepository chefRepository) {
        this.masterclassRepository = masterclassRepository;
        this.userRepository = userRepository;
        this.chefRepository = chefRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<MasterClass>> getRecommendedMasterclasses(@PathVariable Long userId) {
        // Получаем пользователя
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getPreferences() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        // Получаем специализации поваров, подходящие пользователю
        List<Long> chefIds = chefRepository.findAll().stream()
                                           .filter(chef -> user.getPreferences().toLowerCase().contains(chef.getSpecialization().toLowerCase()))
                                           .map(chef -> chef.getId())
                                           .collect(Collectors.toList());

        // Получаем мастер-классы этих поваров
        List<MasterClass> recommendedMasterclasses = masterclassRepository.findAll().stream()
                                                                          .filter(mc -> chefIds.contains(mc.getChef().getId()))
                                                                          .collect(Collectors.toList());

        return ResponseEntity.ok(recommendedMasterclasses);
    }
}
