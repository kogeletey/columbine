package ru.dima.secondseminar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.dima.secondseminar.entities.RecipeIngredient;
import ru.dima.secondseminar.entities.RecipeIngredientId;
import java.util.List;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, RecipeIngredientId> {
    List<RecipeIngredient> findByRecipeId(Long recipeId);
    List<RecipeIngredient> findByIngredientId(Long ingredientId);
}
