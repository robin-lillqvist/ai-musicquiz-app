// app/api/generate-content/route.ts

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { input } = await request.json();

    const AIprompt = `Given the input phrase or sentence, identify the most important word and its word type (noun, verb, adjective, etc.). 
                      The most important word can be a key descriptor, subject, or action in the phrase.
                      
                      Examples:
                      Input: "A yellow ball"
                      Output: "yellow" — adjective

                      Input: "Being clever"
                      Output: "clever" — adjective

                      Input: "Rowing a boat"
                      Output: "rowing" — verb

                      Input: "The quick brown fox"
                      Output: "fox" — noun

                      Input: "She sings beautifully"
                      Output: "sings" — verb

                      Input: "A large cat is sitting"
                      Output: "cat" — noun

                      The input phrase is: ${input}.

                      Make sure to identify the most significant word.
                      Create a JSON object representing the music quiz. 
                      Return this word type in an JSON object with the following structure:
                      The JSON object should have the following structure:
                    {
  
                        "word": "string", // The inputted string
                        "wordType": "string",      // The word type of the inputted string
        
                      }

                      
                      JSON Requirements: 
                      The JSON object should be returned as a plain JSON object without any extra text, explanations, or comments.
                      Never use quotes of any kind within the object values.`;

    const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const rawdata = await model.generateContent(AIprompt);
    const result = rawdata.response.text();

    return new NextResponse(JSON.stringify({ result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return new NextResponse(JSON.stringify({ message: "Error generating content", error: (error as Error).message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
