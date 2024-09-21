// import { CronJob } from "cron";
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
import { getGuardianUrl, getTribuneUrl, getVanguardUrl, getDTrustUrl,getSportUrl } from "../utils/link.grabber.js";
import newspaperData from "../utils/newspaper.links.js";

// const time = process.env.CRON_TIME;
const uri = process.env.MONGODB_URL;

const date = moment().format("YYYY-MM-DD");
const newspaperNames = Object.keys(newspaperData);
let newspapers = [];
let headlineSearchResults = {};

// function to push  a newspaper docu // Only required if success is truement into a global array
const saveToArray = async (newspaperName, urlGrabberFunction) => {
  const imgUrl = await urlGrabberFunction();
  if (!imgUrl) {
    console.log(`No link for ${newspaperName}`);
    return;
  }
  const uploadedLink = await uploadImg(newspaperName, imgUrl);
  if (!uploadedLink) {
    console.log(`No link for ${newspaperName}`);
    return;
  }
  const dataUrlString = await urlToBase64(uploadedLink);
  const hash = await calculateHash(dataUrlString);
  const response = await analyzeImage(dataUrlString);
  if (response.success && response.result) {
    const newspaperInfo = {
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
      // await searchResult.save();
      // console.log(newspapers);
    }
    headlineSearchResults[newspaperName] = searchResultsArray;
  }
};

// function to save or a full data entry to the database
const saveOrUpdateEntry = async (newspapers) => {
  console.log("connecting to db");
  await mongoose.connect(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  });
  console.log("connected to db");
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
        console.log(`newspaper: ${newspaper.name} saved`);
      }
      const entry = new Entry({
        date,
        newspapers: newspapersID.map((newspaper) => newspaper.id),
      });
      await entry.save();
      console.log(`New entry for date: ${date} saved to database`);
      const allNewspapers = Object.keys(headlineSearchResults);
      for (const newspaperName of allNewspapers) {
        for (const searchResult of headlineSearchResults[newspaperName]) {
          console.log("searchResult", searchResult);
          await searchResult.save();
        }
        console.log(`headlines for ${newspaperName} saved`);
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
          console.log("hedline", headlineSearchResults)
          for (const headline of headlineSearchResults[newspaper.name]) {
            headline.newspaperId = existingNewspaper._id;
            await headline.save();
          }
        }
      }
      // Create new newspaper document if it does not exist
      for (const newspaperName of existingNewspaperArray) {
        newspapers = newspapers.filter(
          (newspaper) => newspaper.name !== newspaperName,
        );
      }
      for (const newspaper of newspapers) {
        const savedNewspaper = await newspaper.save();
        existingEntry.newspapers.push(savedNewspaper._id);
        console.log(`Hello`, newspaper);
        SearchResult.insertMany(headlineSearchResults[newspaper.name]);
        
      }
      await existingEntry.save();
      console.log(`Existing entry for date: ${date} updated in database`);
    }
  } catch (error) {
    console.error("Error connecting to database or saving entry:", error);
  } finally {
    newspapers = [];
    mongoose.connection.close();
  }
};

const job = async () => {
  console.log("cron job started");
  try {
    console.log("started fetching data", { time: new Date().toISOString() });
    for (const newspaperName of newspaperNames) {
      console.log(newspaperName);
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
    await saveOrUpdateEntry(newspapers);
    console.log("debug completed ")
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    newspapers = [];
  }
};

export default job;

job();
