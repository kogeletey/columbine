package ru.dima.secondseminar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.dima.secondseminar.entities.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByTelegramId(String telegramId);

    Optional<User> findByTronWallet(String tronWallet);

    boolean existsByTelegramIdOrTronWallet(String telegramId, String walletAddress);

    boolean existsByTelegramId(String telegramId);

    boolean existsByTronWallet(String wallet);

    Optional<User> findByTelegramIdOrTronWallet(String telegramId, String walletAddress);
}
