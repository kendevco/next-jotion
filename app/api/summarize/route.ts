import { Configuration, OpenAIApi } from "openai-edge";
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY!,
  })
);

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  console.log("POST request received");
  try {
    const { documentId, content } = await req.json();
    console.log("Request payload:", { documentId, content });

    if (!documentId || !content) {
      console.error("Invalid request payload");
      return NextResponse.json(
        { error: "Invalid request. Both documentId and content are required." },
        { status: 400 }
      );
    }

    console.log("Sending request to OpenAI");
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes text.",
        },
        {
          role: "user",
          content: `Summarize the following text in 250 characters or less: ${content}`,
        },
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    console.log("OpenAI response received");
    const responseData = await response.json();
    console.log("OpenAI response data:", JSON.stringify(responseData, null, 2));

    if (!responseData.choices || responseData.choices.length === 0) {
      console.error("No choices in OpenAI response");
      return NextResponse.json(
        { error: "No summary generated from OpenAI." },
        { status: 500 }
      );
    }

    const summary = responseData.choices[0].message?.content?.trim();
    console.log("Generated summary:", summary);

    if (!summary) {
      console.error("Summary is empty or undefined");
      return NextResponse.json(
        { error: "Generated summary is empty or undefined." },
        { status: 500 }
      );
    }

    console.log("Saving summary to document");
    await saveSummaryToDocument(documentId, summary);

    console.log("Returning success response");
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarization Error:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
    return NextResponse.json(
      { error: "Failed to summarize text.", details: String(error) },
      { status: 500 }
    );
  }
}

async function saveSummaryToDocument(
  documentId: Id<"documents">,
  summary: string
) {
  console.log("Saving summary for document:", documentId);
  // await convex.mutation(api.documents.update, {
  //   id: documentId,
  //   summary,
  //   summaryLastUpdated: Date.now(),
  // });
}
