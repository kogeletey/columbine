package ru.dima.secondseminar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.dima.secondseminar.entities.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
