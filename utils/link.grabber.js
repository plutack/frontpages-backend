import { load } from "cheerio";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import newspaperData from "./newspaper.links.js";
import "dotenv/config";

puppeteer.use(stealthPlugin());

export const getGuardianUrl = async () => {
  try {
    const response = await fetch(
      "https://epaperbackend.guardian.ng/api/papers/today-paper",
    );
    if (response.ok) {
      const { result } = await response.json();
      return result;
    }
    console.log(" bad fetch for Guardian");
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  }
};

export const getTribuneUrl = async () => {
  const browser = await puppeteer.launch();
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
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(newspaperData.daily_trust, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    const allImg = $(
      ".elementor-element.elementor-element-7fccd0d.e-con-full.e-flex.e-con.e-parent img",
    );
    const img = allImg.eq(1);
    let imgLink = img.attr("data-lazyload");
    imgLink = `https:${imgLink.replace("-scaled", "")}`;
    return imgLink;
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    await browser.close();
  }
};

export const getVanguardUrl = async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(newspaperData.vanguard, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    const allColumns = $(".wp-block-column");
    const imgColumn = allColumns.eq(2);
    const imgLink = imgColumn.find("img").attr("src");
    return imgLink;
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    await browser.close();
  }
};

export const getSportUrl = async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(newspaperData.complete_sports, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    let imgLink = $('head link[rel="image_src"]').attr("href");
    imgLink = imgLink.replace(/\/\d+x\d+\/.*\.jpg$/, "/1135x1600/");
    return imgLink;
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    await browser.close();
  }
};
