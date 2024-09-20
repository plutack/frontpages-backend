import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const schema = {
  description: "api response",
  type: SchemaType.OBJECT,
    properties: {
      success: {
        type: SchemaType.BOOLEAN,
        description: "Success of prompt in parsing input image.",
        nullable: false
      },
      result: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            headline:{
              type: SchemaType.STRING,
              description: "Headline as extracted in image.",
              nullable: false,
            },
            search_query: {
              type: SchemaType.STRING,
              description: "search query to use with google search api to get related news article.",
              nullable: false,
            },
            tag:{
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.STRING,
                description: "Tags to select from as supplied in prompt.",
                nullable: false
              },
              nullable: false,
            },
          }
        },
        nullable: true
      },
      error: {
        type: SchemaType.STRING,
        description: "Error message as supplied in prompt.",
        nullable: true
      }

    }
  }
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" , generationConfig: {
  responseMimeType: "application/json",
  responseSchema: schema,
}
}, );
export async function analyzeImage(dataUrlString){
  const prompt = 'critically find and analyze all the news headlines from the provided image. If the image does not contain a page of news headlines, if image is invalid or has no parsable headline set error key  to  "invalid image".\nOtherwise, for each headline, generate a JSON object with these fields:\n"headline": The extracted headline text.\n"search_query": A concise and relevant Google search query based on the headline.\n"tag": The most appropriate news category (e.g., "politics,", "economy", "business,", "finance",  "sports," "technology," "entertainment," "world", "education", "crime", "health").'

  const result = await model.generateContent([prompt,
        {
      inlineData:{
        mimeType: "image/png",
        data: dataUrlString
      }
    },
  ]);
  
  const response = cleanResponse(await JSON.parse(result.response.text()))
  return response
}

//clean json response from gemini
function cleanResponse(response) {
  if (response.success) {
    response.error = null;
    return { success: response.success, result: response.result, error: response.error }; 
  } 
  response.result = null;
  response.error = response.result?.error || "Image not valid";
  return { success: response.success, result: response.result, error: response.error };

}