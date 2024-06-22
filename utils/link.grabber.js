import { load } from "cheerio";
import puppeteer from "puppeteer-core";
import url from "./newspaper.links.js";

export const getGuardianUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto(url.guardian, {
    waitUntil: "networkidle2",
  });

  const renderedHtml = await page.content();
  const $ = load(renderedHtml);

  const imgLink = $("img.pdf-thumbnail-preview").attr("src");
  await browser.close();
  return imgLink;
};

