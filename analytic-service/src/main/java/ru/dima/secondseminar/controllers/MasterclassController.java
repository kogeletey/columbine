package ru.dima.secondseminar.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.dima.secondseminar.entities.MasterClass;
import ru.dima.secondseminar.entities.Registration;
import ru.dima.secondseminar.repositories.MasterclassRepository;
import ru.dima.secondseminar.repositories.RegistrationRepository;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/masterclasses")
public class MasterclassController {
    private final MasterclassRepository masterclassRepository;
    private final RegistrationRepository registrationRepository;

    public MasterclassController(MasterclassRepository masterclassRepository, RegistrationRepository registrationRepository) {
        this.masterclassRepository = masterclassRepository;
        this.registrationRepository = registrationRepository;
    }

    @GetMapping
    public ResponseEntity<List<MasterClass>> getAllMasterclasses() {

        return ResponseEntity.ok(masterclassRepository.findAll());
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerForMasterclass(@PathVariable Long id, @RequestBody Registration registration) {
        if (!masterclassRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Masterclass not found");
        }

        Optional<MasterClass> cl = masterclassRepository.findById(id);
        if (cl.isEmpty()) {
            return ResponseEntity.status(404).build();
        }


        registration.setMasterclass(cl.get());
        return ResponseEntity.status(201).body(registrationRepository.save(registration));
    }
}
