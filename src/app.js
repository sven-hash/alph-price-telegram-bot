import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });
// in .env you should have your token: TOKEN = "YOUR_TOKEN"

import { respondWithChart, startFetchingCharts } from "./helpers/chart/chart.js";
import { deleteOrSendPrice, getCoinData, warrningPrice } from "./helpers/price/price.js";
import { tokenList } from "./helpers/ayin/tokens_list.js";
import { getAyinTokensPrice, warnningAyin } from "./helpers/ayin/ayin.js";

// set terminal name to price_bot (for windows run price_bot instead of "npm start" name)
function setTerminalTitle(title) {
  process.stdout.write(String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7));
}
setTerminalTitle("Price_bot");

const bot = new Telegraf(process.env.TOKEN);

// short price | price of tokens
bot.command("p", async (ctx) => {
  let [tokenOption, ...rest] = ctx.message.text.split(" ").slice(1);
  const tokenSet = new Set(tokenList.map((t) => t.symbol));
  let data;
  if (tokenOption) {
    tokenOption = tokenOption.toUpperCase();
    if (!tokenSet.has(tokenOption) && tokenOption !== "ALL") data = warnningAyin;
    else {
      data = await getAyinTokensPrice(
        tokenOption === "ALL" ? "all" : tokenList.find((t) => t.symbol === tokenOption)
      );
    }
  } else {
    data = await getCoinData();
  }
  await deleteOrSendPrice(data, ctx);
});
// long price
bot.command("plong", async (ctx) => {
  const coinData = await getCoinData(true);
  await deleteOrSendPrice(coinData, ctx);
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
      await ctx.sendMessage(warrningPrice, {
        reply_to_message_id: ctx.message.message_id,
      });
      break;
  }
});

bot.launch();
