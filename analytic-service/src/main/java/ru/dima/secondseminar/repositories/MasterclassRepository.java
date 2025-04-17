package ru.dima.secondseminar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.dima.secondseminar.entities.MasterClass;
import java.util.List;

public interface MasterclassRepository extends JpaRepository<MasterClass, Long> {
    List<MasterClass> findByChefId(Long chefId);
}
