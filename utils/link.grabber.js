import { load } from "cheerio";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import newspaperData from "./newspaper.links.js";
import "dotenv/config";
import Logger from "./logger.js";


const log = Logger.child({module: "Link Grabber"})

puppeteer.use(stealthPlugin());
export const getGuardianUrl = async () => {
  let browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    let page = await browser.newPage();
    await page.goto(newspaperData.guardian, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    const imgLink = $('img[title="PDF Preview"]').attr("src");
    return imgLink;
  } catch (error) {
    log.error("guardian image link not scrapped successfully", {error})
  } finally {
    await browser.close();
  }
};

export const getTribuneUrl = async () => {
  let browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    let page = await browser.newPage();
    await page.goto(newspaperData.tribune, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    const imgLink = $('img[title="Frontpage Today"]').attr("src");
    return imgLink;
  } catch (error) {
    log.error("tribune image link not scrapped successfully", {error})
  } finally {
    await browser.close();
  }
};

export const getDTrustUrl = async () => {
  let browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    let page = await browser.newPage();
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
  } catch (error) {
    log.error("daily trust image link not scrapped successfully", {error})
  } finally {
    await browser.close();
  }
};

export const getVanguardUrl = async () => {
  let browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    let page = await browser.newPage();
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
  } catch (error) {
    log.error("vanguard image link not scrapped successfully", {error})
  } finally {
    await browser.close();
  }
};

export const getSportUrl = async () => {
  let browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    let page = await browser.newPage();
    await page.goto(newspaperData.complete_sports, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const renderedHtml = await page.content();
    const $ = load(renderedHtml);
    let imgLink = $('head link[rel="image_src"]').attr("href");
    imgLink = imgLink.replace(/\/\d+x\d+\/.*\.jpg$/, "/1135x1600/");
    return imgLink;
  } catch (error) {
    log.error("complete sport image link not scrapped successfully", {error})
  } finally {
    await browser.close();
  }
};
