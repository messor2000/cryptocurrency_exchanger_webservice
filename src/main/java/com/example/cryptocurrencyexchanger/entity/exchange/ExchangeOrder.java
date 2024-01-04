package com.example.cryptocurrencyexchanger.entity.exchange;

import com.example.cryptocurrencyexchanger.entity.user.ExchangerUser;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "exchanger_order")
public class ExchangeOrder {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private ExchangerUser user;

    private String email;

    private String givenCoin;

    private String takenCoin;

    private String network;

    @Column(precision = 15, scale = 7)
    private BigDecimal givenAmount;

    @Column(precision = 15, scale = 7)
    private BigDecimal takenAmount;

    private String wallet;

    private String status;

    private String currentCourse;

    private String coupon;

    @CreationTimestamp
    private Timestamp createdTime;

    private String uniqCode;
}
