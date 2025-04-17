package ru.dima.secondseminar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.dima.secondseminar.entities.Recipe;
import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByChefId(Long chefId);
}