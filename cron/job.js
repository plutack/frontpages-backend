import { CronJob } from "cron";
import newspaperData from "../utils/newspaper.links.js";
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

const time = process.env.CRON_TIME;

const newspaperNames = Object.keys(newspaperData);
let newspapers = [];

const saveToArray = async (newspaperName, urlGrabberFunction) => {
  const imgUrl = await urlGrabberFunction();
  if (!imgUrl) {
    return;
  }
  const uploadedLink = await uploadImg(newspaperName, imgUrl);
  const newspaperInfo = { name: newspaperName, link: uploadedLink };
  newspapers.push(newspaperInfo);
};

const job = new CronJob(time, async () => {
  try {
    console.log(newspapers);
    console.log("started fetching data");
    for (const newspaperName of newspaperNames) {
      switch (newspaperName) {
        case "guardian":
          // await saveToArray(newspaperName, getGuardianUrl);
          break;
        case "tribune":
          // await saveToArray(newspaperName, getTribuneUrl);
          break;
        case "daily_trust":
          // await saveToArray(newspaperName, getDTrustUrl);
          break;
        case "vanguard":
          await saveToArray(newspaperName, getVanguardUrl);
          break;
        case "complete_sports":
          // await saveToArray(newspaperName, getSportUrl);
          break;
        default:
          break;
      }
    }
    const entry = new Entry();
    entry.newspapers = newspapers;
    console.log(entry);
    // const response = await entry.save();
    console.log(response);
  } catch (err) {
    console.error(`${err.name}:${err.message}`);
  } finally {
    newspapers = [];
  }
});

job.start();
