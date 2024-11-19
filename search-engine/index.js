import Logger from "./logger.js";

const log = Logger.child({module: "Google Search"})
const googleSearch = async (query) => {
  try {
    const baseapi = "https://www.googleapis.com/customsearch/v1";
    const key = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.SEARCH_ENGINE_ID;
    const gl = "ng";

    if (!key || !cx) {
      throw new Error(
        "Google API Key or CX is missing from environment variables",
      );
    }

    const url = `${baseapi}?key=${key}&cx=${cx}&q=${query}&gl=${gl}`;
    const response = await fetch(url);

    if (!response.ok) {
      log.error("call to google search api failed")
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items) {
      return [];
    }

    // Format and clean the results
    const formattedAndCleanedResults = data.items.map((item) => ({
      title: item.title || "No title available",
      link: item.link,
      snippet: item.snippet || "No snippet available",
    })).filter((item) => item.link); // Ensure we always have a link

    return formattedAndCleanedResults;
  } catch (error) {
    log.error("error formatting results", {error});
    throw error
  }
};

export default googleSearch;
