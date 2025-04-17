package ru.dima.secondseminar.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Registration {

    @EmbeddedId
    private RegistrationId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @MapsId("masterclassId")
    @JoinColumn(name = "masterclass_id", nullable = false)
    private MasterClass masterclass;
}
