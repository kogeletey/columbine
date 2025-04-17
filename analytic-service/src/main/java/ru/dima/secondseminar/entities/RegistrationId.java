package ru.dima.secondseminar.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationId implements Serializable {

    private Long userId;
    private Long masterclassId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RegistrationId that = (RegistrationId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(masterclassId, that.masterclassId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, masterclassId);
    }
}
