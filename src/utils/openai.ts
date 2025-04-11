// src/utils/openai.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Use process.env
  dangerouslyAllowBrowser: true, // Optional, for browser-side use
});
console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY);

export default openai;
