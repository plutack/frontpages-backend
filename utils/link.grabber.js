import { load } from "cheerio";
import puppeteer from "puppeteer-core";
import newspaperData from "./newspaper.links.js";
import "dotenv/config";

const chromeBinaryPath = process.env.CHROME_BINARY_PATH;

export const getGuardianUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: chromeBinaryPath,
  });
  try {
    const page = await browser.newPage();
    await page.goto(newspaperData.guardian, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    const imgLink = $("img.pdf-thumbnail-preview").attr("src");
    return imgLink;
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    await browser.close();
  }
};

export const getTribuneUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: chromeBinaryPath,
  });
  try {
    const page = await browser.newPage();
    await page.goto(newspaperData.tribune, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    const imgLink = $('img[title="Frontpage Today"]').attr("src");
    return imgLink;
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    await browser.close();
  }
};

export const getDTrustUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: chromeBinaryPath,
  });
  try {
    const page = await browser.newPage();
    await page.goto(newspaperData.daily_trust, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    page.setJavaScriptEnabled(false);
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    let imgLink = $(
      'div.wp-block-themepunch-revslider img[fetchpriority="high"][decoding="async"][class="tp-rs-img rs-lazyload"]'
    ).attr("src");
    console.log(imgLink);
    imgLink = `https:${imgLink.replace("-scaled", "")}`;
    return imgLink;
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    await browser.close();
  }
};

export const getVanguardUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: chromeBinaryPath,
  });
  try {
    const page = await browser.newPage();
    await page.goto(newspaperData.vanguard, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    const imgLink = $("div.wp-block-column img").attr("src");
    return imgLink;
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    await browser.close();
  }
};

export const getSportUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: chromeBinaryPath,
  });
  try {
    const page = await browser.newPage();
    await page.goto(newspaperData.complete_sports, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    const imgLink = $('head link[rel="image_src"]').attr("href");
    imgLink.replace(/\/\d+\/1\/\d+x\d+\/.*\.jpg$/, "/1135x1600/");
    return imgLink;
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    await browser.close();
  }
};
