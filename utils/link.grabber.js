import { load } from 'cheerio'
import puppeteer from 'puppeteer-core'
import newspaperData from './newspaper.links.js'

export const getGuardianUrl = async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BINARY_PATH
  })
  const page = await browser.newPage()

  // Navigate the page to a URL.
  await page.goto(newspaperData.guardian, {
    waitUntil: 'load',
    timeout: 0
  })

  const renderedHtml = await page.content()
  const $ = load(renderedHtml)

  const imgLink = $('img.pdf-thumbnail-preview').attr('src')
  await browser.close()
  return imgLink
}
