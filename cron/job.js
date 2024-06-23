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
import Newspaper from "../model/newspaper.js";
import Entry from "../model/entry.js";

import "dotenv/config";

const time = process.env.CRON_TIME;

const newspaperNames = Object.keys(newspaperData);
const newspapers = [];

const saveToArray = async (newspaperName, urlGrabberFunction) => {
  const uploadedLink = await uploadImg(
    newspaperName,
    await urlGrabberFunction(),
  );
  console.log(uploadedLink);
  const newspaperInfo = { name: newspaperName, link: uploadedLink };
  newspapers.push(newspaperInfo);
};

const job = new CronJob(time, async () => {
  try {
    console.log("started fetching data");
    for (const newspaperName of newspaperNames) {
      switch (newspaperName) {
        case "guardian":
          // await saveToArray(newspaperName, getGuardianUrl);
          break;
        case "tribune":
          await saveToArray(newspaperName, getTribuneUrl);
          break;
        case "daily_trust":
          // await saveToArray(newspaperName, getDTrustUrl);
          break;
        case "vanguard":
          // await saveToArray(newspaperName, getVanguardUrl); // problem
          break;
        case "complete_sports":
          // await saveToArray(newspaperName, getSportUrl);
          break;
        default:
          break;
      }
    }
    const entry = new Entry({ newspapers });
    console.log(entry);
    // const response = await entry.save();
    // console.log(response);
  } catch (error) {
    console.error(error);
  }
});

export default job;
