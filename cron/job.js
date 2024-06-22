import { CronJob } from "cron";
import newspaperData from "../utils/newspaper.links.js";
import { getGuardianUrl } from "../utils/link.grabber.js";
import { uploadImg } from "../utils/cloudinary.operation.js";
import Newspaper from "../model/newspaper.js";
import Entry from "../model/entry.js";

import "dotenv/config";

const time = process.env.CRON_TIME;

const newspaperNames = Object.keys(newspaperData);
const newspapers = [];

const job = new CronJob(time, async () => {
  try {
    console.log("started fetching data");
    for (const newspaperName of newspaperNames) {
      console.log(newspaperName);
      switch (newspaperName) {
        case "guardian":
          const extractedLink = await getGuardianUrl();
          console.log(extractedLink);
          const uploadedLink = await uploadImg(newspaperName, extractedLink);
          const newspaperInfo = { name: newspaperName, link: uploadedLink };
          newspapers.push(newspaperInfo);
          break;

        default:
          break;
      }
    }
    const entry = new Entry({ newspapers: newspapers });
    const response = await entry.save();
    console.log(response);
  } catch (error) {
    console.error(error);
  }
});

export default job;
