import { Hono } from "hono";
import Entry from "../model/entry.js";
import Newspaper from "../model/newspaper.js";
import SearchResult from "../model/search-result.js";
import moment from "moment";

const app = new Hono();

app.get("/", async (c) => {
  try {
    console.log()
    let date = c.req.query("date");
    if (!date) {
      date = moment().format("YYYY-MM-DD");
    } else {
      const isValid = moment(date, "YYYY-MM-DD", true).isValid();
      if (!isValid) {
        return c.json({ success: false, message: "Invalid date format" }, 400);
      }
    }

    const data = await Entry.findOne({
      date: date,
    }).populate('newspapers');

    if (data && data.newspapers) {
      return c.json({
        success: true,
        result: data.newspapers.map((newspaper) => ({
          id: newspaper.id,
          name: newspaper.name,
          link: newspaper.link,
        })),
      });
    }

    return c.json({ success: true, result: [] });
  } catch (err) {
    return c.json({ success: false, message: err.message }, 500);
  }
});


app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const {date, name} = await Newspaper.findOne({_id: id});
    const data = await SearchResult.find(
      {
        newspaperId: id,
      }
    ).populate();
    console.log(data)
    if (data && data.length > 0) {
      return c.json({
        success: true,
        data: {
          name,
          date,
          searchResult: data.map((item)=>{
            return {
              headline: item.headline,
              result: item.result.map((result)=>{
                return {
                  title: result.title,
                  link: result.link,
                  snippet: result.snippet,
                  tags: result.tags,  
                }
              })
            }
          })
        }
      });
    }

    // return c.json({ success: false, message: "No results found" });
  } catch (err) {
    return c.json({ success: false, message: err.message }, 500);
  }
});

export default app;

