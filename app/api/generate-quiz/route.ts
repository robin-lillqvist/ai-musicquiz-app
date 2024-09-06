import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { prompt } = await request.json();

    // Ensure API key is loaded properly
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API key is missing.");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const rawdata = await model.generateContent(prompt);
    const result = rawdata.response?.text() || "";

    return new NextResponse(JSON.stringify({ quiz: result }), {
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
