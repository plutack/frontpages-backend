import { search } from "google-sr";

const googleSearch = async (query) => {
  try {
    const results = await search({
      query: query,
      requestConfig: {
        params: {
          gl: "ng",
        },
      },
    });

    // Format and clean the results
    const formattedAndCleanedResults = results.map(item => ({
      title: item.title || 'No title available',
      link: item.link,
      snippet: item.description || 'No snippet available',
      tags: item.tags || []
    })).filter(item => item.link); // Ensure we always have a link

    return formattedAndCleanedResults;
  } catch (error) {
    console.error("Error in googleSearch:", error);
    throw error;
  }
};

export default googleSearch;
