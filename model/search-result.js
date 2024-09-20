import mongoose from "mongoose";

const searchResultSchema = new mongoose.Schema({
  newspaperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Newspaper",
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
  search_query: {
    type: String,
    required: true,
  },
  result: [
    {
      title: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      snippet: {
        type: String,
        required: true,
      },
      tags: {
        type: [String],
        required: true,
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SearchResult = mongoose.model("SearchResult", searchResultSchema);

export default SearchResult;
