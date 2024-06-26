import { Router } from "express";
import Entry from "../model/entry.js";
import moment from "moment";

const apiRoute = Router();

apiRoute.get("/api/today", async (req, res) => {
  try {
    let date = new Date();
    let data = await Entry.findOne({
      date: moment(date).format("YYYY-MM-DD"),
    });
    if (data) {
      return res.json(data);
    }
    // send previous day data
    date.setDate(date.getDate - 1);
    data = await Entry.findOne({ date: moment(date).format("YYYY-MM-DD") });
    if (data) {
      return res.json(data);
    }
    throw new Error("no data available");
  } catch (err) {
    if (err.message === "no data available") {
      return res.json({ success: false, message: "updates coming soon" });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
});

export default apiRoute;
