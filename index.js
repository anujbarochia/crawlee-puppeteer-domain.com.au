const routes = require("./routes");
const {
  PuppeteerCrawler,
  Dataset,
  RequestQueue,
  RequestList,
  ProxyConfiguration,
} = require("crawlee");
const puppeteerExtra = require("puppeteer-extra"); // comes with extra plugins on top of puppetter
const stealthPlugin = require("puppeteer-extra-plugin-stealth"); // Applies various evasion techniques to make detection of puppeteer harder.
const readline = require("readline");
const csvHeaders = require("./csv-headers");
const { createObjectCsvWriter } = require("csv-writer");
puppeteerExtra.use(stealthPlugin());
const csvWriter = createObjectCsvWriter({
  path: "data.csv",
  header: csvHeaders,
});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
require("dotenv").config();

(async () => {
  const requestList = await RequestList.open(null, [
    { url: "https://www.domain.com.au/sale/?postcode=2085&ssubs=0&page=1" }, //22
    { url: "https://www.domain.com.au/sale/?postcode=2095&ssubs=0&page=1" }, //41
    { url: "https://www.domain.com.au/sale/?postcode=2033&ssubs=0&page=1" }, //30
    { url: "https://www.domain.com.au/sale/?postcode=2045&ssubs=0&page=1" }, //6
    { url: "https://www.domain.com.au/sale/?postcode=2068&ssubs=0&page=1" }, //42
    { url: "https://www.domain.com.au/sale/?postcode=4350&ssubs=0&page=1" }, //595
  ]);
  const requestQueue = await RequestQueue.open();

  const enqueue = async (request) => {
    return requestQueue.addRequest(request, {
      forefront: request.userData.forefront,
    });
  };
  const pushData = async (item) => {
    await Dataset.pushData(item);
    return csvWriter.writeRecords([item]);
  };
  const options = {
    requestList,
    requestQueue,
    maxConcurrency: 4,
    maxRequestRetries: 200,
    launchContext: {
      useChrome: true,
      launcher: puppeteerExtra,
      launchOptions: {
        // Other puppeteer options
        // ignoreDefaultArgs: ["--enable-automation"],
        headless: false,
        // devtools: true,
        defaultViewport: null,
        args: ["--window-size=1920,1080", "--force-device-scale-factor=1"],
      },
    },
    preNavigationHooks: [
      async ({ page }, gotoOptions) => {
        // await page.setExtraHTTPHeaders({
        //   "user-agent":
        //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36",
        //   "upgrade-insecure-requests": "1",
        //   accept:
        //     "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        //   "accept-encoding": "gzip, deflate, br",
        //   "accept-language": "en-US,en;q=0.9,en;q=0.8",
        // });
        gotoOptions.waitUntil = "domcontentloaded";
      },
    ],
    postNavigationHooks: [
      async ({ session, response, request, page, proxyInfo }) => {
        if (response.status() === 403 || response.status() === 429) {
          console.log(
            `Request blocked with status code : ${response.status()} - ${
              request.url
            } `
          );
          // Solving captcha manually
          if (!process.env.PROXY || process.env.MANUAL_CAPTCHA == "1") {
            await new Promise((resolve) =>
              rl.question("Please resolve the captcha...", (ans) => {
                rl.close();
                resolve(ans);
              })
            );
            await page.reload();
          } else {
            await new Promise((r) => setTimeout(r, 3000));
            session.retire();
            throw new Error(
              `Request blocked with status code : ${response.status()} - ${
                request.url
              }`
            );
          }
        }
      },
    ],
    requestHandler: async (context) => {
      let { request } = context;
      console.log(`Opening page ${request.label} : ${request.url}`);
      switch (request.label) {
        case "DETAIL":
          return routes.handleDetail({ context, pushData, enqueue });
        case "LIST":
          return routes.handleList({ context, enqueue });
        default:
          return routes.handleLanding({ context, enqueue });
      }
    },
  };

  if (process.env.PROXY) {
    options.proxyConfiguration = new ProxyConfiguration({
      proxyUrls: [process.env.PROXY],
    });
  }
  const crawler = new PuppeteerCrawler(options);

  await crawler.run();
})();
