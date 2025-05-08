package ru.dima.secondseminar.dto;

import lombok.Data;

@Data
public class TokenStatsDTO {
    public String name;
    public String tokenType;
    public String logo;
    public String totalSupply;
    public String projectPage;
    public String marketCap;
    public String holders;
    public String totalTransfers;
    public String transfersYesterday;
    public String volume24h;
    public String liquidity;
    public String contractAddress;
    public String creationDate;

    public static String createPrettyResponse(String contractAddress, TokenStatsDTO dto) {
        return String.format("""
        🟢 *Token Information* 🟢
        
        🏷 *Name*: %s
        📊 *Type*: %s
        🌐 *Project Page*: [Website](%s)
        
        📈 *Market Stats*
        ├─ 💰 Market Cap: `%s`
        ├─ 💦 24h Volume: `%s`
        └─ 🏊 Liquidity: `%s`
        
        📊 *Token Distribution*
        ├─ 🧮 Total Supply: `%s`
        ├─ 👥 Holders: `%s`
        ├─ 🔄 Total Transfers: `%s`
        └─ 📅 Yesterday's Transfers: `%s`
        
        📝 *Contract Details*
        ├─ 📜 Address: `%s`
        └-- 🗓 Created: %s
        """,
         dto.getName(),
         dto.getTokenType(),
         dto.getProjectPage(),
         dto.getMarketCap(),
         dto.getVolume24h(),
         dto.getLiquidity(),
         dto.getTotalSupply(),
         dto.getHolders(),
         dto.getTotalTransfers(),
         dto.getTransfersYesterday(),
         contractAddress,
         dto.getCreationDate()
        );
    }
}

