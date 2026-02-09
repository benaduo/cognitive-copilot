import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const base64Data = image.split(",")[1];

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const systemPrompt = `
       You are the "Cognitive Co-Pilot" for individuals with cognitive disabilities.
       Analyze this image and provide ONE simple, clear instruction.
       Focus on the most important actionable item.
       Example: If looking at a door, say "Pull the silver handle."
       Be direct and brief. Avoid unnecessary details. Only provide one instruction.
       `;

    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const text = result.response.text();

    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 },
    );
  }
}
