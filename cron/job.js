import { CronJob } from "cron";
import mongoose from "mongoose";
import newspaperData from "../utils/newspaper.links.js";
import moment from "moment";
import {
  getGuardianUrl,
  getTribuneUrl,
  getDTrustUrl,
  getVanguardUrl,
  getSportUrl,
} from "../utils/link.grabber.js";
import { uploadImg } from "../utils/cloudinary.operation.js";
import Entry from "../model/entry.js";

import "dotenv/config";
import Newspaper from "../model/newspaper.js";

const time = process.env.CRON_TIME;
const uri = process.env.MONGODB_URL;

const date = moment().format("YYYY-MM-DD");
const newspaperNames = Object.keys(newspaperData);
let newspapers = [];

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
  const newspaperInfo = { name: newspaperName, link: uploadedLink };
  const newspaper = new Newspaper(newspaperInfo);
  newspapers.push(newspaper);
  console.log(newspapers);
};

const saveOrUpdateEntry = async (newspapers) => {
  const dbConnection = await mongoose.connect(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  });
  try {
    const existingEntry = await Entry.findOne({ date }).populate("newspapers");
    console.log(existingEntry);

    if (!existingEntry) {
      const newspapersID = newspapers.map((newspaper) => newspaper._id);
      for (const newspaper of newspapers) {
        await newspaper.save();
        console.log(`newspaper: ${newspaper.name} saved`);
      }
      const entry = new Entry({ newspapersID });
      await entry.save();
      console.log(`New entry for date: ${date} saved to database`);
      return;
    } else {
      const extraNewspaperID = [];
      for (const newspaper of newspapers) {
        console.log("existing newspaprers", existingEntry.newspapers);
        if (
          !existingEntry.newspapers.some(
            (existingNewspaper) => existingNewspaper.name === newspaper.name,
          )
        ) {
          await newspaper.save();
          extraNewspaperID.push(newspaper._id);
        }
      }
      if (extraNewspaperID.length) {
        await existingEntry.updateOne(
          {},
          { $push: { newspapers: { $each: extraNewspaperID } } },
        );
        console.log(`Existing entry for date: ${date}  updated in database`);
        return;
      }
      console.log(`No update made on existing entry for date: ${date}`);
    }
  } catch (error) {
    console.error("Error connecting to database or saving entry:", error);
  } finally {
    await dbConnection.disconnect();
  }
};

const job = new CronJob(time, async () => {
  console.log("cron job started");
  try {
    console.log("started fetching data");
    for (const newspaperName of newspaperNames) {
      switch (newspaperName) {
        case "guardian":
          // await saveToArray(newspapegit rName, getGuardianUrl);
          break;
        case "tribune":
          await saveToArray(newspaperName, getTribuneUrl);
          break;
        case "daily_trust":
          await saveToArray(newspaperName, getDTrustUrl);
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
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    newspapers = [];
  }
});

job.start();
