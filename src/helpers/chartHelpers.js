import puppeteer from "puppeteer";
import fs from "fs";
import { getIntervalChart } from "./screenshot.js";
import { StopWatch } from "./stopWatch.js";

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
    await ctx.sendMessage(errorMsg);
  }
};

// GET ALL CHARTS
const intervals = ["5", "15", "1H", "4H", "1D"];
const getAllCharts = async () => {
  const stopWatch = new StopWatch();
  stopWatch.start();
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    defaultViewport: { height: 1080, width: 1920 },
  });
  console.log("Start fetching charts....");
  for (const [index, i] of intervals.entries()) {
    await getIntervalChart(browser, i, index);
  }
  await browser.close();
  stopWatch.stop();
  console.log(stopWatch.durationToString("m", "Charts done!"));
};

const fetchInterval = 4; //minutes
export const startFetchingCharts = async () => {
  await getAllCharts();
  setInterval(async () => {
    await getAllCharts();
  }, fetchInterval * 60 * 1000);
};
