const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const ALEPHIUM_API_URL = "https://backend-v113.mainnet.alephium.org";
const ONE_MILLION = 1_000_000;
const fetchData = async (url, errorMsg) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${errorMsg}: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const getSupply = async (typeOfSupply) => {
  try {
    const supply = await fetchData(
      `${ALEPHIUM_API_URL}/infos/supply/${typeOfSupply}`,
      "ERROR FETCH ALEPHIUM"
    );
    if (supply > ONE_MILLION) return (supply / ONE_MILLION).toFixed(1);
    return supply;
  } catch (error) {
    throw error;
  }
};

const getMarketData = async () => {
  try {
    const data = await fetchData(
      `${COINGECKO_API_URL}/coins/alephium`,
      "ERROR FETCH COINGECKO"
    );
    return data.market_data;
  } catch (error) {
    throw error;
  }
};

export const getCoinData = async (long = false) => {
  try {
    // GET MARKET DATA FROM COINGECKO
    const marketData = await getMarketData();
    const volume = new Intl.NumberFormat("en-EN").format(marketData.total_volume.usd);
    // GET CURR SUPPLY FROM ALPH BACKEND
    const currentSupply = await getSupply("circulating-alph");
    // GET RESERVED SUPPLY FROM ALPH BACKEND
    const reservedSupply = await getSupply("reserved-alph");
    // GET MARKET CAP
    const marketCap = (currentSupply * marketData.current_price.usd).toFixed(1);
    // COMBINE ALL INTO ONE DATA
    const coinData = {
      currentPriceUsd: marketData.current_price.usd.toFixed(4),
      currentPriceBtc: marketData.current_price.btc.toFixed(8),
      change1H: marketData.price_change_percentage_1h_in_currency.usd.toFixed(2),
      change24H: marketData.price_change_percentage_24h.toFixed(2),
      change7D: marketData.price_change_percentage_7d.toFixed(2),
      high24: marketData.high_24h.usd.toFixed(4),
      low24: marketData.low_24h.usd.toFixed(4),
      volume: volume,
    };

    if (long)
      return (
        `💸Price[USD]: $${coinData.currentPriceUsd}\n` +
        `🤑Price[BTC]: ${coinData.currentPriceBtc} ₿\n` +
        `📈L: $${coinData.low24} | H: $${coinData.high24}\n` +
        `⏳1H: ${coinData.change1H}%\n` +
        `⏳24H: ${coinData.change24H}%\n` +
        `⏳7D: ${coinData.change7D}%\n` +
        `📊Volume: $${coinData.volume}\n` +
        `🔓Circulating supply: ${currentSupply}M\n` +
        `🔐Reserved supply: ${reservedSupply}M\n` +
        `💰Market cap: $${marketCap}M\n`
      );

    return (
      `💸Price[USD]: $${coinData.currentPriceUsd}\n` +
      `🤑Price[BTC]: ${coinData.currentPriceBtc} ₿\n` +
      `📈L: $${coinData.low24} | H: $${coinData.high24}\n` +
      `⏳1H: ${coinData.change1H}%\n` +
      `⏳24H: ${coinData.change24H}%\n` +
      `⏳7D: ${coinData.change7D}%\n` +
      `📊Volume: $${coinData.volume}\n`
    );
  } catch (error) {
    const errorMsg = `Error occured: ${error.message}`;
    console.log(errorMsg);
    return "Error occured. Please try again.";
  }
};
