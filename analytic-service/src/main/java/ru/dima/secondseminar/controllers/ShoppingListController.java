package ru.dima.secondseminar.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.dima.secondseminar.entities.RecipeIngredient;
import ru.dima.secondseminar.repositories.RecipeIngredientRepository;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequestMapping("/api/shopping-list")
public class ShoppingListController {
    private final RecipeIngredientRepository recipeIngredientRepository;

    public ShoppingListController(RecipeIngredientRepository recipeIngredientRepository) {
        this.recipeIngredientRepository = recipeIngredientRepository;
    }

    @PostMapping
    public ResponseEntity<?> generateShoppingList(@RequestBody Long recipeId) {
        List<RecipeIngredient> ingredients = recipeIngredientRepository.findByRecipeId(recipeId);
        if (ingredients.isEmpty()) {
            return ResponseEntity.badRequest().body("No ingredients found for this recipe");
        }
        return ResponseEntity.ok(ingredients);
    }
}