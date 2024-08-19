import { Router } from "express";
import Entry from "../model/entry.js";
import moment from "moment";

const apiRoute = Router();

apiRoute.get("/api/today", async (req, res) => {
  try {
    let date = new Date();
    let data = await Entry.findOne({
      date: moment(date).format("YYYY-MM-DD"),
    }).populate('newspapers');

    if (!data) {
      // If no data for today, check yesterday
      date.setDate(date.getDate() - 1);
      data = await Entry.findOne({
        date: moment(date).format("YYYY-MM-DD"),
      }).populate('newspapers');
    }

    if (data && data.newspapers && data.newspapers.length > 0) {
      return res.json({
        papers: data.newspapers.map((newspaper) => ({
          paperName: newspaper.name,
          paperLink: newspaper.link,
        })),
        timestamp: Date.now(),
      });
    }

    return res.json({ success: false, message: "updates coming soon" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

export default apiRoute;