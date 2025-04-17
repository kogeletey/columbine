package ru.dima.secondseminar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.dima.secondseminar.entities.Registration;
import ru.dima.secondseminar.entities.RegistrationId;
import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, RegistrationId> {
    List<Registration> findByUserId(Long userId);
    List<Registration> findByMasterclassId(Long masterclassId);
}
