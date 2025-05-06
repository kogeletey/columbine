package ru.dima.secondseminar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.dima.secondseminar.entities.User;

public interface RequestRepository extends JpaRepository<User, Long> {
}
