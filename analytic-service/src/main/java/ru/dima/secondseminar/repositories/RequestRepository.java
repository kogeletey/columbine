package ru.dima.secondseminar.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.dima.secondseminar.entities.Request;

public interface RequestRepository extends JpaRepository<Request, Long> {

    Optional<Request> findByAddressOrHash(String contractAddress, String transactionHash);
}
