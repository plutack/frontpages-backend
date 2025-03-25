import { Hono } from "hono";
import Entry from "../model/entry.js";
import Newspaper from "../model/newspaper.js";
import SearchResult from "../model/search-result.js";
import moment from "moment";

const app = new Hono();

app.get("/", async (c) => {
  try {
    let date = c.req.query("date");
    if (!date) {
      date = moment().format("YYYY-MM-DD");
    } else {
      const isValid = moment(date, "YYYY-MM-DD", true).isValid();
      if (!isValid) {
        return c.json({ success: false, message: "Invalid date format" }, 400);
      }
    }

    const data = await Entry.findOne({ date }).populate("newspapers");

    return c.json({
      success: true,
      result:
        data?.newspapers?.map(({ id, name, link }) => ({ id, name, link })) ||
        [],
    });
  } catch (err) {
    return c.json({ success: false, message: err.message }, 500);
  }
});

app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const newspaper = await Newspaper.findOne({ _id: id });

    if (!newspaper) {
      return c.json({ success: false, message: "Newspaper not found" }, 404);
    }

    const { date, name } = newspaper;
    const data = await SearchResult.find({ newspaperId: id }).populate();

    if (!data.length) {
      return c.json({ success: false, message: "No results found" }, 404);
    }

    return c.json({
      success: true,
      data: {
        name,
        date,
        searchResult: data.map(({ headline, result }) => ({
          headline,
          result: result.map(({ title, link, snippet, tags }) => ({
            title,
            link,
            snippet,
            tags,
          })),
        })),
      },
    });
  } catch (err) {
    return c.json({ success: false, message: err.message }, 500);
  }
});

export default app;
