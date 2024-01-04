package com.example.cryptocurrencyexchanger.entity.coin;

import lombok.*;
import org.springframework.lang.NonNull;

import javax.persistence.*;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor(force = true)
@EqualsAndHashCode
@Table(name = "coin")
public class Coin {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NonNull
    private String name;

    @NonNull
    private String wallet;

    @NonNull
    private String network;

    @Column(precision = 12, scale = 4)
    private BigDecimal margin;

    @Column(unique = true)
    private String symbol;

    @Column(precision = 12, scale = 4)
    private BigDecimal amount;

    @Column(precision = 12, scale = 4)
    private BigDecimal minAmount;
}
