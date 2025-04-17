package ru.dima.secondseminar.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.dima.secondseminar.entities.MasterClass;
import ru.dima.secondseminar.entities.Registration;
import ru.dima.secondseminar.entities.User;
import ru.dima.secondseminar.repositories.MasterclassRepository;
import ru.dima.secondseminar.repositories.RegistrationRepository;
import ru.dima.secondseminar.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final MasterclassRepository masterclassRepository;

    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.status(201).body(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent() && existingUser.get().getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(existingUser.get());
        }

        return ResponseEntity.status(401).body(null);
    }

    @PostMapping("/getAllMasterClasses")
    public ResponseEntity<List<MasterClass>> getUserRegistrations(@RequestBody User user) {
        List<MasterClass> registrations = registrationRepository.findByUserId(user.getId()).parallelStream().map(Registration::getMasterclass).toList();

        return ResponseEntity.ok(registrations);
    }
}
