import { getMarketData } from "../price/price.js";
import { tokenList } from "./tokens_list.js";

const alphDecimals = 18;
const getTokenSupply = async (token, priceUsd) => {
  try {
    let response = await fetch(
      `https://backend.mainnet.alephium.org/addresses/${token.contractid}/tokens/${token.tokenid}/balance`
    );
    if (!response.ok) throw new Error(`ERROR FETCH TOKEND BALANCE: ${response.status}`);
    const balanceToken = (await response.json()).balance / 10 ** token.decimals;
    response = await fetch(
      `https://backend.mainnet.alephium.org/addresses/${token.contractid}/balance`
    );
    if (!response.ok) throw new Error(`ERROR FETCH ALPH BALANCE: ${response.status}`);
    const balanceAlph = (await response.json()).balance / 10 ** alphDecimals;

    const priceAlph = balanceAlph / balanceToken;
    return {
      name: token.symbol,
      priceAlph: priceAlph.toFixed(8) + " א",
      priceUsd: "$" + (priceAlph * priceUsd).toFixed(4),
    };
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const formatTokenString = (token) => {
  return `ALPH-${token.name}\n💸Price[USD]: ${token.priceUsd}\n🤑Price[ALPH]: ${token.priceAlph}`;
};
export const getAyinTokensPrice = async (option) => {
  try {
    const priceUsd = (await getMarketData()).current_price.usd.toFixed(4);
    if (option === "all") {
      const allTokensPrice = await Promise.all(
        tokenList.map(async (token) => await getTokenSupply(token, priceUsd))
      );
      return allTokensPrice
        .map((token) => formatTokenString(token))
        .join("\n---------------\n");
    } else {
      return formatTokenString(await getTokenSupply(option, priceUsd));
    }
  } catch (error) {
    console.log(error);
    return "Error occured. Please try again.";
  }
};
// getAyinTokensPrice(tokenList[2]);

export const warnningAyin = `This command is for tokens on ALPH!\nOptions: all, ${tokenList
  .slice(0, 3)
  .map((t) => " " + t.symbol.toLowerCase())}...\nExample: /p alf or /p all`;
