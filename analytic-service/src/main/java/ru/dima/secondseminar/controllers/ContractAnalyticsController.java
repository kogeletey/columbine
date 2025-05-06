package ru.dima.secondseminar.controllers;

import java.time.Instant;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import ru.dima.secondseminar.dto.DappRadarDTO;
import ru.dima.secondseminar.dto.TokenStatsDTO;
import ru.dima.secondseminar.dto.TronScanResponse;
import ru.dima.secondseminar.dto.TronsCanTrcResponse;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class ContractAnalyticsController {

    private final WebClient tronscanClient;

    private final WebClient dappRadarClient;

    public ContractAnalyticsController(@Qualifier("tronscan") WebClient tronscanClient,
                                       @Qualifier("dappRadar") WebClient dappRadarClient) {
        this.tronscanClient = tronscanClient;
        this.dappRadarClient = dappRadarClient;
    }

    @GetMapping("tronscan/{tokenAddress}")
    public TokenStatsDTO getMainInfo(@PathVariable String tokenAddress) {
        TokenStatsDTO result = new TokenStatsDTO();

        TronScanResponse response = tronscanClient.get()
                                                  .uri(uriBuilder -> uriBuilder
                                                          .path("/contract")
                                                          .queryParam("contract", tokenAddress)
                                                          .build())
                                                  .retrieve()
                                                  .bodyToMono(TronScanResponse.class)
                                                  .block();

        result.setContractAddress(response.getData().get(0).getAddress());
        result.setName(response.getData().get(0).getTokenInfo().getTokenName());
        result.setCreationDate(Instant.ofEpochSecond(response.getData().get(0).getDateCreated()).toString());
        result.setTokenType(response.getData().get(0).getTokenInfo().getTokenType());
        result.setLogo(response.getData().get(0).getTokenInfo().getTokenLogo());

        DappRadarDTO response2 = dappRadarClient.get()
                                                .uri(uriBuilder -> uriBuilder.path("/tron/" + tokenAddress).build())
                                                .retrieve()
                                                .bodyToMono(DappRadarDTO.class).block();

        result.setMarketCap(response2.getResults().getMarketCap());

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

        return result;
    }
}
