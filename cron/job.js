/* eslint-disable no-unused-vars */
import { CronJob } from "cron";
import "dotenv/config";
import moment from "moment";
import mongoose from "mongoose";
import { analyzeImage } from "../llm/image.processor.js";
import Entry from "../model/entry.js";
import Newspaper from "../model/newspaper.js";
import SearchResult from "../model/search-result.js";
import googleSearch from "../search-engine/index.js";
import { uploadImg } from "../utils/cloudinary.operation.js";
import {
  calculateHash,
  compareHash,
  urlToBase64,
} from "../utils/hash.functions.js";
import {
  getDTrustUrl,
  getGuardianUrl,
  getSportUrl,
  getTribuneUrl,
  getVanguardUrl,
} from "../utils/link.grabber.js";
import newspaperData from "../utils/newspaper.links.js";
import Logger from "../utils/logger.js";

const log = Logger.child({module: "Cron Job"})

// const time = process.env.CRON_TIME;
const uri = process.env.MONGODB_URL;

const newspaperNames = Object.keys(newspaperData);
let newspapers = [];
let headlineSearchResults = {};

// function to push  a newspaper docu // Only required if success is truement into a global array
const saveToArray = async (newspaperName, urlGrabberFunction) => {
  log.info("saving newspaper", {newspaper: newspaperName})
  const date = moment().format("YYYY-MM-DD");
  const imgUrl = await urlGrabberFunction();
  if (!imgUrl) {
    log.warn("No link for newspaper", {newspaper: newspaperName});
    return;
  }
  const uploadedLink = await uploadImg(newspaperName, imgUrl);
  if (!uploadedLink) {
    log.warn("No link for newspaper", {newspaper: newspaperName});
    return;
  }
  const dataUrlString = await urlToBase64(uploadedLink);
  const hash = await calculateHash(dataUrlString);
  const response = await analyzeImage(dataUrlString);
  if (response.success && response.result) {
    const newspaperInfo = {
      date,
      name: newspaperName,
      link: uploadedLink,
      hash,
      data: response.result,
    };
    const newspaper = new Newspaper(newspaperInfo);
    newspapers.push(newspaper);
    // create search results for the newspaper headlines
    let searchResultsArray = [];
    for (const item of response.result) {
      const result = await googleSearch(item.search_query);
      result.tags = item.tag;
      const searchResultData = {
        newspaperId: newspaper._id,
        headline: item.headline,
        search_query: item.search_query,
        result,
        hash,
      };

      const searchResult = new SearchResult(searchResultData);
      searchResultsArray.push(searchResult);
    }
    headlineSearchResults[newspaperName] = searchResultsArray;
  }
};

// function to save or a full data entry to the database
const saveOrUpdateEntry = async (newspapers, date) => {
  log.info("connecting to database");
  await mongoose.connect(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  });
  log.info("connected to database");
  try {
    //check if entry already exists already
    const existingNewspaperArray = [];
    const existingEntry = await Entry.findOne({ date }).populate("newspapers");
    // initiate save of new entry
    if (!existingEntry) {
      const newspapersID = [];
      for (const newspaper of newspapers) {
        const { id } = await newspaper.save();
        newspapersID.push({ id, name: newspaper.name });
        log.info("newspaper saved", {name: newspaper.name});
      }
      const entry = new Entry({
        date,
        newspapers: newspapersID.map((newspaper) => newspaper.id),
      });
      await entry.save();
      log.info("New entry saved to database", { date });
      const allNewspapers = Object.keys(headlineSearchResults);
      for (const newspaperName of allNewspapers) {
        for (const searchResult of headlineSearchResults[newspaperName]) {
          await searchResult.save();
        }
        log.info("headlines saved", {name: newspaperName});
      }
      return;
    }
    for (const newspaper of newspapers) {
      const existingNewspaper = await Newspaper.findOne({
        date,
        name: newspaper.name,
      });
      if (existingNewspaper) {
        // Update existing newspaper if needed
        const isSame = compareHash(existingNewspaper.hash, newspaper.hash);
        if (isSame) {
          existingNewspaperArray.push(existingNewspaper.name);
        }
        if (!isSame) {
          existingNewspaper.link = newspaper.link;
          existingNewspaper.hash = newspaper.hash;
          existingNewspaper.data = newspaper.data;
          await existingNewspaper.save();
          SearchResult.deleteMany({ newspaperId: existingNewspaper._id });
          for (const headline of headlineSearchResults[newspaper.name]) {
            headline.newspaperId = existingNewspaper._id;
            await headline.save();
          }
        }}
      log.info("New entry saved to database", { date });
      for (const newspaperName of existingNewspaperArray) {
        newspapers = newspapers.filter(
          (newspaper) => newspaper.name !== newspaperName,
        );
      }
      for (const newspaper of newspapers) {
        const savedNewspaper = await newspaper.save();
        existingEntry.newspapers.push(savedNewspaper._id);
        SearchResult.insertMany(headlineSearchResults[newspaper.name]);
      }
      await existingEntry.save();
      log.info("existing entry updated in database", {date});
    }
  } catch (error) {
    log.fatal("error connecting to database or saving entry", {error});
  } finally {
    await mongoose.disconnect();
    log.info("disconnected from database");
  }
};

const job = new CronJob("50 9 * * *", async () => {
  const date = moment().format("YYYY-MM-DD");
  log.info("cron job started");
  try {
   log.info("started cron job", { date });
    for (const newspaperName of newspaperNames) {
      switch (newspaperName) {
        case "guardian":
          await saveToArray(newspaperName, getGuardianUrl);
          break;
        case "tribune":
          await saveToArray(newspaperName, getTribuneUrl);
          break;
        case "daily_trust":
          // await saveToArray(newspaperName, getDTrustUrl);
          break;
        case "vanguard":
          await saveToArray(newspaperName, getVanguardUrl);
          break;
        case "complete_sports":
          await saveToArray(newspaperName, getSportUrl);
          break;
        default:
          break;
      }
    }
    await saveOrUpdateEntry(newspapers, date);
    log.info("completed cron job successfully ");
  } catch (error) {
    log.fatal("cron job failed", {error})
  } finally {
    newspapers = [];
    headlineSearchResults = {};
    log.info("temp data object cleared");
  }
});

job.start();
