const sleep = async (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const getIntervalChart = async (browser, interval, index) => {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.goto(
    `https://www.tradingview.com/chart/?symbol=GATEIO%3AALPHUSDT&interval=${interval}`,
    { waitUntil: "networkidle2" }
  );
  await sleep(2);
  // select dark mode just when you first open the browser
  if (index === 0) {
    await page.waitForSelector(".layout__area--topleft [data-role='button']", {
      timeout: 0,
    });
    //open menu
    await page.$eval(".layout__area--topleft [data-role='button']", (menu) => {
      menu.click();
    });
    // select dark mode
    await page.$eval("[value='themeSwitcher']", (darkmode) => {
      darkmode.click();
    });
    // close the menu
    await page.$eval(".layout__area--topleft [data-role='button']", (menu) => {
      menu.click();
    });

    await sleep(2);
  }

  // click to open watchlist (closing the watchlist has bug, so this way is easier to screenshot)
  await page.waitForSelector("[data-name='base']", { timeout: 0 });
  await page.$eval("[data-name='base']", (watchList) => {
    if (Array.from(watchList.classList).some((clas) => clas.includes("isActive")))
      watchList.click();
  });
  await sleep(1);

  const imgName = isFinite(interval) ? `${interval}m` : interval;

  const x = 60,
    y = 40;
  const height = 1080 - 120,
    width = 1920 - 110;
  await page.screenshot({
    path: `./src/chartImgs/${imgName}.png`,
    clip: { height: height, width: width, x: x, y: y },
  });

  console.log(`Processed ${imgName}`);
  await page.close();
};
