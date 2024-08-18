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
    const existingEntry = await Entry.findOne({ date }).populate('newspapers');

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
      return;
    } else {
      for (const newspaper of newspapers) {
        const existingNewspaper = await Newspaper.findOne({ date, name: newspaper.name });
        if (existingNewspaper) {
          // Update existing newspaper
          existingNewspaper.link = newspaper.link;
          await existingNewspaper.save();
        } else {
          // Create new newspaper
          const savedNewspaper = await newspaper.save();
          existingEntry.newspapers.push(savedNewspaper._id);
        }
      }
      await existingEntry.save();
      console.log(`Existing entry for date: ${date} updated in database`);
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
        await saveToArray(newspaperName, getGuardianUrl);
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
