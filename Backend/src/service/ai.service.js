import { GoogleGenerativeAI } from "@google/generative-ai";

const model = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY).getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    apikey: process.env.GOOGLE_API_KEY,
});

export async function testAI() {
  try {
    const result = await model.generateContent("What is ai full form ? ");
    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    console.error("Error invoking the model:", error);
  }
}
