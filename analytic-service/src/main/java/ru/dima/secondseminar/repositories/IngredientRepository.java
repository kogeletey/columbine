package ru.dima.secondseminar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.dima.secondseminar.entities.Ingredient;
import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    Optional<Ingredient> findByName(String name);
}
