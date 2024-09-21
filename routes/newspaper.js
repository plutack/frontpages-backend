import { Hono } from "hono";
import Entry from "../model/entry.js";
import moment from "moment";

const app = new Hono()

app.get("/", async (ctx) => {
  try {

    let {date} = ctx.req.query
    if (date) {
      const isValid = moment(date, "YYYY-MM-DD", true).isValid()
      if (!isValid) return ctx.redirect("/")
    }
    date = new Date();
    let data
    let rewindDays = 3
    while (!data || rewindDays > 0) {
      data = await Entry.findOne({
        date: moment(date).format("YYYY-MM-DD"),
      }).populate('newspapers');
      // If no data, check previous day
      date.setDate(date.getDate() - 1);
      rewindDays--;
    }
    if (data && data.newspapers && data.newspapers.length > 0) {
      return ctx.json({
        success: true,
        result: data.newspapers.map((newspaper) => ({
          name: newspaper.name,
          link: newspaper.link,
        })),
      });
    }

    return ctx.json({ success: true, result: []});
  } catch (err) {
    return ctx.status(400).json({ success: false, message: err.message });
  }
});

export default app;