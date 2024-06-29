import { load } from "cheerio";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import newspaperData from "./newspaper.links.js";
import "dotenv/config";

puppeteer.use(stealthPlugin());

const chromeBinaryPath = process.env.CHROME_BINARY_PATH;
export const getGuardianUrl = async () => {
  try {
    const response = await fetch(
      "https://epaperbackend.guardian.ng/api/papers/today-paper",
    );

    const { result } = await response.json();
    return result;
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
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
    const elements = $(".site-branding.e-paper-header-logo");
    const secondElement = elements.eq(1);
    const imgLink = secondElement.find("img").attr("src");
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
