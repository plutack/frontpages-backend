import { load } from "cheerio";
import puppeteer from "puppeteer-core";
import newspaperData from "./newspaper.links.js";

export const getGuardianUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BINARY_PATH,
  });
  const page = await browser.newPage();

  await page.goto(newspaperData.guardian, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const renderedHtml = await page.content();
  const $ = load(renderedHtml);

  const imgLink = $("img.pdf-thumbnail-preview").attr("src");
  await browser.close();
  return imgLink;
};

export const getTribuneUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BINARY_PATH,
  });
  const page = await browser.newPage();

  await page.goto(newspaperData.tribune, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const renderedHtml = await page.content();
  const $ = load(renderedHtml);

  const imgLink = $('img[title="Frontpage Today"]').attr("src");
  console.log(imgLink);
  await browser.close();
  return imgLink;
};

export const getDTrustUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BINARY_PATH,
  });
  const page = await browser.newPage();

  await page.goto(newspaperData.daily_trust, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const renderedHtml = await page.content();
  const $ = load(renderedHtml);

  let imgLink = $(
    'img[fetchpriority="high"][decoding="async"][class="tp-rs-img rs-lazyload"]'
  ).attr("src");
  await browser.close();
  imgLink = `https:${imgLink.replace("-scaled", "")}`;
  return imgLink;
};
export const getVanguardUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BINARY_PATH,
  });
  const page = await browser.newPage();

  await page.goto(newspaperData.vanguard, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const renderedHtml = await page.content();
  const $ = load(renderedHtml);
  console.log(renderedHtml);

  const imgLink = $("div.wp-block-column img").attr("src");
  console.log(imgLink);
  await browser.close();
  return imgLink;
};

export const getSportUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BINARY_PATH,
  });
  const page = await browser.newPage();

  await page.goto(newspaperData.complete_sports, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const renderedHtml = await page.content();
  const $ = load(renderedHtml);

  let imgLink = $('head link[rel="image_src"]').attr("href");
  await browser.close();
  imgLink.replace(/\/\d+\/1\/\d+x\d+\/.*\.jpg$/, "/1135x1600/");
  return imgLink;
};
