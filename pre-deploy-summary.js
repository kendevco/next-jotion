// pre-deploy-summary.js

// Use require instead of import for CommonJS
const { Configuration, OpenAIApi } = require("openai-edge");
const { ConvexHttpClient } = require("convex/browser");
const { api } = require("./convex/_generated/api"); // Ensure this is the correct path
require("dotenv").config();

const SUMMARY_UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

// Initialize OpenAI client
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Initialize Convex HTTP Client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function generateSummary(document) {
  try {
    console.log(`Generating summary for document ID: ${document._id}`);

    const response = await openai.createCompletion({
      model: "gpt-4o-mini",
      prompt: `Summarize the following text in 250 characters or less: ${document.content}`,
      max_tokens: 100,
      temperature: 0.5,
    });

    const responseData = await response.json();
    const summary = responseData.choices[0]?.text?.trim();

    console.log(`Generated summary: ${summary}`);

    if (summary) {
      await convex.mutation(api.documents.update, {
        id: document._id,
        summary,
        summaryLastUpdated: Date.now(),
      });

      console.log(`Updated summary for document ID: ${document._id}`);
    }
  } catch (error) {
    console.error(`Failed to generate summary for document ID: ${document._id}`, error);
  }
}

async function preGenerateSummaries() {
  try {
    console.log("Fetching all documents...");

    // Use the api to query all documents
    const documents = await convex.query(api.documents.getAllDocuments, {});
    console.log(`Fetched ${documents.length} documents.`);

    for (const document of documents) {
      if (!document.content) {
        console.log(`Skipping document ID: ${document._id} (no content)`);
        continue;
      }

      const now = Date.now();
      const needsUpdate =
        !document.summary ||
        (document.summaryLastUpdated &&
          now - document.summaryLastUpdated > SUMMARY_UPDATE_INTERVAL);

      if (needsUpdate) {
        await generateSummary(document);
      } else {
        console.log(`No update needed for document ID: ${document._id}`);
      }
    }
  } catch (error) {
    console.error("Error during summary generation:", error);
  }
}

preGenerateSummaries()
  .then(() => {
    console.log("Finished generating summaries.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during execution:", error);
    process.exit(1);
  });
