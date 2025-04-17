package ru.dima.secondseminar.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.dima.secondseminar.entities.Chef;
import ru.dima.secondseminar.repositories.ChefRepository;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequestMapping("/api/chefs")
public class ChefController {
    private final ChefRepository chefRepository;

    public ChefController(ChefRepository chefRepository) {
        this.chefRepository = chefRepository;
    }

    @GetMapping
    public ResponseEntity<List<Chef>> getAllChefs() {
        return ResponseEntity.ok(chefRepository.findAll());
    }
}
