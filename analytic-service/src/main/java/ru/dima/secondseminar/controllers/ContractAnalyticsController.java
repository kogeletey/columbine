package ru.dima.secondseminar.controllers;

import java.time.Instant;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import ru.dima.secondseminar.dto.TokenStatsDTO;
import ru.dima.secondseminar.dto.TransactionAnalysisDTO;
import ru.dima.secondseminar.dto.TronScanResponse;
import ru.dima.secondseminar.dto.TronsCanTrcResponse;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class ContractAnalyticsController {

    private final WebClient tronscanClient;
    private final WebClient analyticServiceClient;

    public ContractAnalyticsController(
            @Qualifier("tronscan") WebClient tronscanClient,
            @Qualifier("anltcService") WebClient analyticServiceClient) {
        this.tronscanClient = tronscanClient;
        this.analyticServiceClient = analyticServiceClient;
    }

    @GetMapping("tronscan/{tokenAddress}")
    public TokenStatsDTO getMainInfo(@PathVariable String tokenAddress) {
        TokenStatsDTO result = new TokenStatsDTO();

        TronScanResponse response1 = tronscanClient.get()
                                                   .uri(uriBuilder -> uriBuilder
                                                           .path("/contract")
                                                           .queryParam("contract", tokenAddress)
                                                           .build())
                                                   .retrieve()
                                                   .bodyToMono(TronScanResponse.class)
                                                   .block();

        result.setContractAddress(response1.getData().get(0).getAddress());
        result.setName(response1.getData().get(0).getTokenInfo().getTokenName());
        result.setCreationDate(Instant.ofEpochSecond(response1.getData().get(0).getDateCreated()).toString());
        result.setTokenType(response1.getData().get(0).getTokenInfo().getTokenType());
        result.setLogo(response1.getData().get(0).getTokenInfo().getTokenLogo());

        TronsCanTrcResponse response3 = tronscanClient.get()
                                                      .uri(uriBuilder -> uriBuilder
                                                              .path("/token_trc20")
                                                              .queryParam("contract", tokenAddress)
                                                              .queryParam("showAll", "1")
                                                              .build())
                                                      .retrieve()
                                                      .bodyToMono(TronsCanTrcResponse.class)
                                                      .block();

        result.setLiquidity(response3.getTrc20_tokens().get(0).getLiquidity24h());
        result.setVolume24h(response3.getTrc20_tokens().get(0).getVolume());
        result.setTransfersYesterday(response3.getTrc20_tokens().get(0).getTransfer24h());
        result.setTotalTransfers(response3.getTrc20_tokens().get(0).getTransfer_num());
        result.setTotalTransfers(response3.getTrc20_tokens().get(0).getHolders_count());
        result.setTotalSupply(response3.getTrc20_tokens().get(0).getTotal_supply_with_decimals());
        result.setProjectPage(response3.getTrc20_tokens().get(0).getHome_page());
        result.setHolders(response3.getTrc20_tokens().get(0).getHolders_count());
        result.setMarketCap(response3.getTrc20_tokens().get(0).getMarket_cap_usd() + "$");

        return result;
    }

    public TransactionAnalysisDTO getTransactionInfo(@PathVariable("transactionHash") String transactionHash) {
        return analyticServiceClient.get()
                                    .uri(uriBuilder -> uriBuilder
                                            .path("/" + transactionHash)
                                            .build())
                                    .retrieve()
                                    .bodyToMono(TransactionAnalysisDTO.class)
                                    .block();
    }
}
