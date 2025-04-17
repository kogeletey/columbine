package ru.dima.secondseminar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.dima.secondseminar.entities.Chef;

public interface ChefRepository extends JpaRepository<Chef, Long> {
}
