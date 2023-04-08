import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });
// in .env you should have your token: TOKEN = "YOUR_TOKEN"

import { respondWithChart, startFetchingCharts } from "./helpers/chart/chart.js";
import { getCoinData } from "./helpers/price/price.js";

// set terminal name to price_bot (for windows run price_bot instead of "npm start" name)
function setTerminalTitle(title) {
  process.stdout.write(String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7));
}
setTerminalTitle("Price_bot");

const bot = new Telegraf(process.env.TOKEN);

// short price
bot.command("p", async (ctx) => {
  const coinData = await getCoinData();
  await ctx.sendMessage(coinData);
});
// long price
bot.command("plong", async (ctx) => {
  const coinData = await getCoinData(true);
  await ctx.sendMessage(coinData);
});
// charts
startFetchingCharts();
bot.command("chart", async (ctx) => {
  const [interval, ...rest] = ctx.message.text.split(" ").slice(1);
  switch (interval) {
    case "5m":
      respondWithChart(ctx, interval);
      break;
    case "15m":
      respondWithChart(ctx, interval);
      break;
    case "1h":
      respondWithChart(ctx, interval);
      break;
    case "4h":
      respondWithChart(ctx, interval);
      break;
    case "1d":
      respondWithChart(ctx, interval);
      break;
    default:
      await ctx.sendMessage(`Options: 5m, 15m, 1h, 4h, 1d\nexample: /chart 5m`, {
        reply_to_message_id: ctx.message.message_id,
      });
      break;
  }
});

bot.launch();
