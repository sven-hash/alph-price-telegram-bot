import fetch from "node-fetch";
import { Telegraf } from "telegraf";
import "./env.js";

const API_URL = "https://api.coingecko.com/api/v3";

const getCoinData = async () => {
  try {
    const response = await fetch(`${API_URL}/coins/alephium`);

    if (!response.ok) throw new Error(`ERROR FETCH: ${response.status}`);

    const data = await response.json();
    const marketData = data.market_data;
    const volume = new Intl.NumberFormat("en-EN").format(
      marketData.total_volume.usd
    );
    const coinData = {
      currentPrice: marketData.current_price.usd.toFixed(4),
      change1H:
        marketData.price_change_percentage_1h_in_currency.usd.toFixed(2),
      change24H: marketData.price_change_percentage_24h.toFixed(2),
      change7D: marketData.price_change_percentage_7d.toFixed(2),
      high24: marketData.high_24h.usd.toFixed(4),
      low24: marketData.low_24h.usd.toFixed(4),
      volume: volume,
    };
    return (
      `💰Price: $${coinData.currentPrice}\n` +
      `📈L: $${coinData.low24} | H: $${coinData.high24}\n` +
      `⏳1H: ${coinData.change1H}%\n` +
      `⏳24H: ${coinData.change24H}%\n` +
      `⏳7D: ${coinData.change7D}%\n` +
      `📊Volume: $${coinData.volume}\n`
    );
  } catch (error) {
    const errorMsg = `Error occured: ${error.message}`;
    console.log(errorMsg);
    return errorMsg;
  }
};

const bot = new Telegraf(process.env.TOKEN);

bot.command("p", async (ctx) => {
  const coinData = await getCoinData();

  // Explicit usage
  // await ctx.telegram.sendMessage(ctx.message.chat.id, coinData);

  // Using context shortcut
  await ctx.sendMessage(coinData);
});

bot.launch();
