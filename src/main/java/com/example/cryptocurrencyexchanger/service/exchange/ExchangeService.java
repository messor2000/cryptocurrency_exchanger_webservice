package com.example.cryptocurrencyexchanger.service.exchange;

import com.example.cryptocurrencyexchanger.entity.exchange.ExchangeOrder;
import com.example.cryptocurrencyexchanger.entity.user.ExchangerUser;

import java.util.List;

public interface ExchangeService {
    void makeAnExchange(ExchangeOrder order, String network);

    void payForExchange(ExchangeOrder order);

    void completeExchange(ExchangeOrder order);

    void cancelExchange(ExchangeOrder order);

    void freezeExchange(ExchangeOrder order);

    void deleteExchange(ExchangeOrder order);

    ExchangeOrder findOrderById(Long id);

    ExchangeOrder findOrderByCode(String code);

    List<ExchangeOrder> getAllExchangeOrders(ExchangerUser user);

    List<ExchangeOrder> getAllExchangeOrdersByStatus(String status);

}
