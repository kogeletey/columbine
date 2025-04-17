package ru.dima.secondseminar.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "masterclasses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MasterClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @ManyToOne
    @JoinColumn(name = "chef_id")
    private Chef chef;
}
