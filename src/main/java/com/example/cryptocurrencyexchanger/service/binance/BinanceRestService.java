package com.example.cryptocurrencyexchanger.service.binance;

import com.example.cryptocurrencyexchanger.service.coin.CoinService;
import com.webcerebrium.binance.api.BinanceApi;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class BinanceRestService implements BinanceService {

    private static final String USDT_SYMBOL = "USDT";
    private static final String USD_SYMBOL = "USD";
    private static final String UAH_SYMBOL = "UAH";
    private static final String EUR_SYMBOL = "EUR";
    private static final String PLN_SYMBOL = "PLN";
    private static final String RUB_SYMBOL = "RUB";

    BinanceApi binanceApi;
    CoinService coinService;

    @Override
    public BigDecimal getResultPriceFirstInput(BigDecimal amount, String firstSymbol, String secondSymbol) {
        if (isSymbolUSD(firstSymbol) && !isSymbolUSD(secondSymbol)) {
            return getResultPriceIfFirstInputUSDT(amount, secondSymbol);
        } else if (isSymbolUSD(secondSymbol) && !isSymbolUSD(firstSymbol)) {
            return getResultPriceIfSecondInputUSDT(amount, firstSymbol);
        } else if (isFiatCoin(firstSymbol) && !isFiatCoin(secondSymbol)) {
            return getPriceFirstInputFiat(amount, firstSymbol, secondSymbol);
        } else if (isFiatCoin(secondSymbol) && isFiatCoin(firstSymbol)) {
            return getPriceBothInputFiat(amount, firstSymbol, secondSymbol);
        } else if (isBothSymbolsUSD(firstSymbol, secondSymbol)) {
            return getResultPriceForBothUSDFirstInput(amount, secondSymbol);
        } else {
            return getPriceFirstInput(amount, firstSymbol, secondSymbol);
        }
    }

    @Override
    public BigDecimal getResultPriceSecondInput(BigDecimal amount, String firstSymbol, String secondSymbol) {
        if (isSymbolUSD(secondSymbol) && !isSymbolUSD(secondSymbol)) {
            return getResultPriceIfFirstInputUSDT(amount, secondSymbol);
        } else if (isSymbolUSD(secondSymbol) && !isSymbolUSD(firstSymbol)) {
            return getResultPriceIfSecondInputUSDT(amount, firstSymbol);
        } else if (isFiatCoin(secondSymbol) && !isFiatCoin(firstSymbol)) {
            return getPriceSecondInputFiat(amount, firstSymbol, secondSymbol);
        } else if (isFiatCoin(secondSymbol) && isFiatCoin(firstSymbol)) {
            return getPriceBothInputFiat(amount, firstSymbol, secondSymbol);
        } else if (isBothSymbolsUSD(firstSymbol, secondSymbol)) {
            return getResultPriceForBothUSDSecondInput(amount, firstSymbol);
        } else {
            return getPriceSecondInput(amount, firstSymbol, secondSymbol);
        }
    }

    @Override
    public BigDecimal getPairPrice(String firstSymbol, String secondSymbol) {
        if (isSymbolUSD(firstSymbol) && !isBothSymbolsUSD(firstSymbol, secondSymbol)) {
            return resultPriceFirstInputUSD(secondSymbol);
        } else if (isSymbolUSD(secondSymbol) && !isBothSymbolsUSD(firstSymbol, secondSymbol)) {
            return getCoinPriceInUSDT(firstSymbol);
        } else if (isFiatCoin(firstSymbol) && !isFiatCoin(secondSymbol)) {
            return getPriceWhenFirstInputFiat(firstSymbol, secondSymbol);
        } else if (isFiatCoin(secondSymbol) && !isFiatCoin(firstSymbol)) {
            return getPriceWhenSecondInputFiat(firstSymbol, secondSymbol);
        } else if (isFiatCoin(secondSymbol) && isFiatCoin(firstSymbol)) {
            return getPriceWhenBothInputFiat(firstSymbol, secondSymbol);
        } else if (isBothSymbolsUSD(firstSymbol, secondSymbol)) {
            return new BigDecimal(1).setScale(4, RoundingMode.HALF_UP);
        }
        BigDecimal firstCoinInUSDT = getCoinPriceInUSDT(firstSymbol);
        BigDecimal secondCoinInUSDT = getCoinPriceInUSDT(secondSymbol);

        return firstCoinInUSDT.divide(secondCoinInUSDT, 5, RoundingMode.HALF_UP);
    }

    private BigDecimal getResultPriceIfFirstInputUSDT(BigDecimal amount, String symbol) {
        BigDecimal takenCoinInUSDT = getCoinPriceInUSDT(symbol);

        if (isFiatCoin(symbol)) {
            BigDecimal amountOfTakenCoin = amount.multiply(takenCoinInUSDT);
            BigDecimal marginOfTakenCoin = calculateResultMarginFiat(amountOfTakenCoin, symbol);
            return amountOfTakenCoin.add(marginOfTakenCoin);
        }

        BigDecimal amountOfTakenCoin = amount.divide(takenCoinInUSDT, 7, RoundingMode.HALF_UP);
        BigDecimal marginOfTakenCoin = calculateResultMarginFiat(amountOfTakenCoin, symbol);
        BigDecimal resultMargin = amountOfTakenCoin.multiply(marginOfTakenCoin).divide(new BigDecimal(100), 7, RoundingMode.HALF_UP);

        return amountOfTakenCoin.add(resultMargin);
    }

    private BigDecimal getResultPriceIfSecondInputUSDT(BigDecimal amount, String symbol) {
        BigDecimal coinPriceInUSDT = getCoinPriceInUSDT(symbol);

        if (isFiatCoin(symbol)) {
            BigDecimal amountOfTakenCoin = amount.divide(coinPriceInUSDT, 4, RoundingMode.HALF_UP);
            BigDecimal marginOfTakenCoin = calculateResultMarginFiat(amountOfTakenCoin, symbol);
            return amountOfTakenCoin.subtract(marginOfTakenCoin);
        }

        BigDecimal amountOfTakenCoin = amount.multiply(coinPriceInUSDT);
        BigDecimal marginOfTakenCoin = calculateResultMarginFiat(amountOfTakenCoin, symbol);
        BigDecimal resultMargin = amountOfTakenCoin.multiply(marginOfTakenCoin).divide(new BigDecimal(100), 7, RoundingMode.HALF_UP);

        return amountOfTakenCoin.subtract(resultMargin);
    }

    private BigDecimal getPriceFirstInput(BigDecimal amount, String firstSymbol, String secondSymbol) {
        BigDecimal amountOfTakenCoin = calculateResultAmountTakenCoins(amount, firstSymbol, secondSymbol);
        BigDecimal resultMargin = calculateResultMargin(amountOfTakenCoin, secondSymbol);

        if (isFiatCoin(secondSymbol)) {
            return calculateResultAmountTakenFiatInput(amount, firstSymbol, secondSymbol);
        }

        return amountOfTakenCoin.add(resultMargin);
    }

    private BigDecimal getPriceSecondInput(BigDecimal amount, String firstSymbol, String secondSymbol) {
        BigDecimal amountOfTakenCoin = calculateResultAmountTakenCoins(amount, firstSymbol, secondSymbol);
        BigDecimal resultMargin = calculateResultMargin(amountOfTakenCoin, secondSymbol);

        if (isFiatCoin(firstSymbol)) {
            return calculateResultAmountTakenFiatInput(amount, firstSymbol, secondSymbol);
        }

        return amountOfTakenCoin.subtract(resultMargin);
    }

    private BigDecimal getPriceFirstInputFiat(BigDecimal amount, String firstSymbol, String secondSymbol) {
        BigDecimal amountOfTakenCoin = calculateResultAmountTakenFiatInput(amount, firstSymbol, secondSymbol);
        BigDecimal resultMargin = calculateResultMarginFiat(amountOfTakenCoin, secondSymbol);

        return amountOfTakenCoin.add(resultMargin);
    }

    private BigDecimal getPriceSecondInputFiat(BigDecimal amount, String firstSymbol, String secondSymbol) {
        BigDecimal amountOfTakenCoin = calculateResultAmountTakenFiatInput(amount, firstSymbol, secondSymbol);
        BigDecimal resultMargin = calculateResultMarginFiat(amountOfTakenCoin, secondSymbol);

        return amountOfTakenCoin.subtract(resultMargin);
    }

    private BigDecimal getPriceBothInputFiat(BigDecimal amount, String firstSymbol, String secondSymbol) {
        BigDecimal amountOfTakenCoin = calculateResultAmountTakenFiatInput(amount, firstSymbol, secondSymbol);
        BigDecimal resultMargin = calculateResultMarginFiat(amountOfTakenCoin, secondSymbol);

        return amountOfTakenCoin.add(resultMargin);
    }

    private BigDecimal getResultPriceForBothUSDFirstInput(BigDecimal amount, String firstSymbol) {
        BigDecimal priceInUSD = new BigDecimal(1).multiply(amount).setScale(4, RoundingMode.HALF_UP);
        BigDecimal resultMargin = calculateResultMarginFiat(priceInUSD, firstSymbol);

        return priceInUSD.add(resultMargin);
    }

    private BigDecimal getResultPriceForBothUSDSecondInput(BigDecimal amount, String firstSymbol) {
        BigDecimal priceInUSD = new BigDecimal(1).multiply(amount).setScale(4, RoundingMode.HALF_UP);
        BigDecimal resultMargin = calculateResultMarginFiat(priceInUSD, firstSymbol);

        return priceInUSD.subtract(resultMargin);
    }

    private BigDecimal calculateResultAmountTakenCoins(BigDecimal amount, String firstSymbol, String secondSymbol) {
        BigDecimal givenCoinInUSDT = getCoinPriceInUSDT(firstSymbol);
        BigDecimal takenCoinInUSDT = getCoinPriceInUSDT(secondSymbol);

        BigDecimal priceWithAmount = givenCoinInUSDT.multiply(amount);

        return priceWithAmount.divide(takenCoinInUSDT, 7, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateResultAmountTakenFiatInput(BigDecimal amount, String firstSymbol, String secondSymbol) {
        BigDecimal givenCoinInUSDT = getCoinPriceInUSDT(firstSymbol);
        BigDecimal takenCoinInUSDT = getCoinPriceInUSDT(secondSymbol);

        if (isFiatCoinWithoutEuro(secondSymbol) && !isFiatCoin(firstSymbol)) {
            return givenCoinInUSDT.multiply(takenCoinInUSDT).multiply(amount).setScale(4, RoundingMode.HALF_UP);
        } else if (!isFiatCoin(secondSymbol) && isFiatCoinWithoutEuro(firstSymbol)) {
            return amount.multiply(takenCoinInUSDT.divide(givenCoinInUSDT, 4, RoundingMode.HALF_UP));
        } else if (isFiatCoinWithoutEuro(secondSymbol) && isFiatCoinWithoutEuro(firstSymbol)) {
            return amount.multiply(takenCoinInUSDT.divide(givenCoinInUSDT, 4, RoundingMode.HALF_UP));
        } else if (secondSymbol.startsWith(EUR_SYMBOL)) {
            return amount.divide(givenCoinInUSDT, 2, RoundingMode.HALF_UP).multiply(takenCoinInUSDT).setScale(4, RoundingMode.HALF_UP);
        } else if (firstSymbol.startsWith(EUR_SYMBOL)) {
            return takenCoinInUSDT.multiply(amount.divide(givenCoinInUSDT, 4, RoundingMode.HALF_UP));
        }

        return amount.divide(givenCoinInUSDT, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal(1).divide(takenCoinInUSDT, 4, RoundingMode.HALF_UP));
    }

    private BigDecimal calculateResultMargin(BigDecimal amountOfTakenCoin, String symbol) {
        BigDecimal marginOfTakenCoin = getCoinMargin(symbol);
        return amountOfTakenCoin.multiply(marginOfTakenCoin).divide(new BigDecimal(100), 7, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateResultMarginFiat(BigDecimal amountOfTakenCoin, String symbol) {
        BigDecimal marginOfTakenCoin = getCoinMargin(symbol);
        return amountOfTakenCoin.multiply(marginOfTakenCoin).divide(new BigDecimal(100), 4, RoundingMode.HALF_UP);
    }

    private BigDecimal getCoinMargin(String symbol) {
        return coinService.getCoinByCoinSymbol(symbol).getMargin();
    }

    private BigDecimal getPriceWhenFirstInputFiat(String firstSymbol, String secondSymbol) {
        BigDecimal firstSymbolUSD = getCoinPriceInUSDT(firstSymbol);
        BigDecimal secondSymbolInUSD = getCoinPriceInUSDT(secondSymbol);

        return new BigDecimal(1).divide(firstSymbolUSD, 7, RoundingMode.HALF_UP)
                .multiply(new BigDecimal(1).divide(secondSymbolInUSD, 7, RoundingMode.HALF_UP));
    }

    private BigDecimal getPriceWhenSecondInputFiat(String firstSymbol, String secondSymbol) {
        BigDecimal firstSymbolUSD = getCoinPriceInUSDT(firstSymbol);
        BigDecimal secondSymbolInUSD = getCoinPriceInUSDT(secondSymbol);

        return firstSymbolUSD.multiply(secondSymbolInUSD).setScale(4, RoundingMode.HALF_UP);
    }

    private BigDecimal getPriceWhenBothInputFiat(String firstSymbol, String secondSymbol) {
        BigDecimal firstSymbolUSD = getCoinPriceInUSDT(firstSymbol);
        BigDecimal secondSymbolInUSD = getCoinPriceInUSDT(secondSymbol);

        if (secondSymbol.startsWith(EUR_SYMBOL)) {
            return new BigDecimal(1).divide(firstSymbolUSD, 4, RoundingMode.HALF_UP).multiply(secondSymbolInUSD);
        } else if (firstSymbol.startsWith(EUR_SYMBOL)) {
            return secondSymbolInUSD.multiply(new BigDecimal(1).divide(firstSymbolUSD, 4, RoundingMode.HALF_UP));
        }

        return secondSymbolInUSD.divide(firstSymbolUSD, 4, RoundingMode.HALF_UP);
    }

    private BigDecimal resultPriceFirstInputUSD(String symbol) {
        BigDecimal takenCoinInUSDT = getCoinPriceInUSDT(symbol);
        if (isFiatCoin(symbol)) {
            return takenCoinInUSDT.setScale(4,  RoundingMode.HALF_UP);
        }
        return new BigDecimal(1).divide(takenCoinInUSDT, 7, RoundingMode.HALF_UP);
    }

    private boolean isFiatCoin(String symbol) {
        return symbol.startsWith(UAH_SYMBOL) || symbol.startsWith(RUB_SYMBOL)
                || symbol.startsWith(PLN_SYMBOL) || symbol.startsWith(EUR_SYMBOL);
    }

    private boolean isFiatCoinWithoutEuro(String symbol) {
        return symbol.startsWith(UAH_SYMBOL) || symbol.startsWith(RUB_SYMBOL)
                || symbol.startsWith(PLN_SYMBOL);
    }


    private boolean isBothSymbolsUSD(String firstSymbol, String secondSymbol) {
        return (firstSymbol.equals(USDT_SYMBOL) || firstSymbol.startsWith(USD_SYMBOL))
                && (secondSymbol.equals(USDT_SYMBOL) || secondSymbol.startsWith(USD_SYMBOL));
    }

    private boolean isSymbolUSD(String firstSymbol) {
        return firstSymbol.equals(USDT_SYMBOL) || firstSymbol.startsWith(USD_SYMBOL);
    }

    @SneakyThrows
    private BigDecimal getCoinPriceInUSDT(String symbol) {
        if (symbol.startsWith(EUR_SYMBOL)) {
            return binanceApi.pricesMap().get(symbol.substring(0, 3) + USDT_SYMBOL);
        }

        if(isFiatCoin(symbol) ) {
            BigDecimal fiatPriceUSDT = binanceApi.pricesMap().get(USDT_SYMBOL + symbol.substring(0, 3));
            if (fiatPriceUSDT == null) {
                return binanceApi.pricesMap().get("BUSD" + symbol.substring(0, 3));
            }
            return fiatPriceUSDT;
        }

        return binanceApi.pricesMap().get(symbol + USDT_SYMBOL);
    }
}
