import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey : process.env.GEMINI_API});

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });
  // console.log(response.text);
  return response.text
}


// async function main(prompt) {
//   const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use the correct method
//   const result = await model.generateContent(prompt); // This returns a response object
//   const response = await result.response; // Get the actual response
//   const text = response.text(); // Extract text
//   console.log(text);
//   return text;
// }

// async function listModels() {
//   const response = await ai.models.list();       // response is an object
//   // const models = response.models;                // extract the array
//   console.log(response);
// }
// listModels();

export default main;