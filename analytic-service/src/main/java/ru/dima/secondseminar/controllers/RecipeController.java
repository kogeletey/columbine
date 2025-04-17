package ru.dima.secondseminar.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.dima.secondseminar.entities.Recipe;
import ru.dima.secondseminar.repositories.RecipeRepository;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final RecipeRepository recipeRepository;

    public RecipeController(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @GetMapping
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        return ResponseEntity.ok(recipeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createRecipe(@RequestBody Recipe recipe) {
        if (recipe.getTitle() == null || recipe.getChef() == null) {
            return ResponseEntity.badRequest().body("Title and chef_id are required");
        }
        return ResponseEntity.status(201).body(recipeRepository.save(recipe));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long id) {
        return recipeRepository.findById(id)
                               .map(ResponseEntity::ok)
                               .orElse(ResponseEntity.status(404).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable Long id, @RequestBody Recipe updatedRecipe) {
        return recipeRepository.findById(id).map(recipe -> {
            recipe.setTitle(updatedRecipe.getTitle());
            return ResponseEntity.ok(recipeRepository.save(recipe));
        }).orElse(ResponseEntity.status(404).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id) {
        if (!recipeRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Recipe not found");
        }
        recipeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
