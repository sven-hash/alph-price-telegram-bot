import puppeteer from "puppeteer";
import fs from "fs";
import { getIntervalChart } from "./screenshot.js";
import { StopWatch } from "../stopWatch.js";

// RESPOND WITH CHART
export const respondWithChart = async (ctx, interval) => {
  const imgName = interval.includes("m") ? interval : interval.toUpperCase();
  try {
    const image = fs.readFileSync(`./src/chartImgs/${imgName}.png`);
    await ctx.replyWithPhoto(
      {
        source: image,
      },
      { reply_to_message_id: ctx.message.message_id, caption: `${imgName} ALPH/USDT` }
    );
  } catch (error) {
    const errorMsg = `Can't get chart for ${imgName}`;
    console.log(errorMsg);
    const { message_id } = await ctx.sendMessage(errorMsg);
    setTimeout(() => ctx.deleteMessage(message_id), 60000);
  }
};

// GET ALL CHARTS
const intervals = ["5", "15", "1H", "4H", "1D"];
const getAllCharts = async (browser, shouldTurnDarkMode = false) => {
  try {
    const stopWatch = new StopWatch();
    stopWatch.start();
    console.log("Start fetching charts....");
    for (const [index, interval] of intervals.entries()) {
      await getIntervalChart(browser, interval, index, shouldTurnDarkMode);
    }
    stopWatch.stop();
    console.log(stopWatch.durationToString("m", "Charts done!"));
  } catch (error) {
    console.log(`ERROR IN GETALLCHARTS: ${error.message}`);
  }
};

// UPDATE CHARTS ON INTERVAL
const fetchInterval = 5; //minutes
export const startFetchingCharts = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    defaultViewport: { height: 1080, width: 1920 },
  });

  await getAllCharts(browser, true);
  setInterval(async () => {
    await getAllCharts(browser);
  }, fetchInterval * 60 * 1000);
};
