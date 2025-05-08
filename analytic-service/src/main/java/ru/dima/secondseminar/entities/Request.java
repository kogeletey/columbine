package ru.dima.secondseminar.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.dima.secondseminar.converter.TokenStatsDTOConverter;
import ru.dima.secondseminar.converter.TransactionAnalysisDTOConverter;
import ru.dima.secondseminar.dto.TokenStatsDTO;
import ru.dima.secondseminar.dto.TransactionAnalysisDTO;

@Entity
@Table(name = "request", indexes = {
        @Index(name = "idx_request_hash", columnList = "hash"),
        @Index(name = "idx_request_address", columnList = "address")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 100)
    private String hash;

    @Column(unique = true, length = 100)
    private String address;

    @Column(nullable = false, columnDefinition = "TEXT")
    @Convert(converter = TokenStatsDTOConverter.class)
    private TokenStatsDTO addressResult;

    @Column(nullable = false, columnDefinition = "TEXT")
    @Convert(converter = TransactionAnalysisDTOConverter.class)
    private TransactionAnalysisDTO transactionResult;

    @ManyToMany(mappedBy = "requests")
    private Set<User> users;
}
