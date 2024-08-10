/* import { useState, useEffect, useCallback } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";

const SUMMARY_UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

const useSummarizer = (documentId: Id<"documents">) => {
  const document = useQuery(api.documents.getById, { documentId });
  const updateDocument = useMutation(api.documents.update);
  const generateSummary = useMutation(api.documents.generateSummary);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log("Document ID:", documentId);
  console.log("Fetched document:", document);

  const needsSummaryUpdate = useCallback(() => {
    if (!document) return false;
    if (!document.summary) return true;
    const now = Date.now();
    const needsUpdate = now - (document.summaryLastUpdated || 0) > SUMMARY_UPDATE_INTERVAL;
    console.log("Needs summary update:", needsUpdate);
    return needsUpdate;
  }, [document]);

  const summarizeText = useCallback(
    async (content: string) => {
      setLoading(true);
      setError(null);

      console.log("Summarizing text:", content);

      try {
        const updatedDocument = await updateDocument({
          id: documentId,
          content,
          summary: undefined, // Invalidate the current summary
          summaryLastUpdated: undefined,
        });

        console.log("Updated document with new content:", updatedDocument);

        if (updatedDocument) {
          // Call generateSummary if content was successfully updated
          const generatedSummary = await generateSummary({ documentId });
          console.log("Generated summary response:", generatedSummary);
          if (generatedSummary?.summary) {
            setSummary(generatedSummary.summary);
          }
        }
      } catch (err) {
        console.error("Summarization Error:", err);
        setError("Failed to summarize text.");
      } finally {
        setLoading(false);
      }
    },
    [documentId, updateDocument, generateSummary]
  );

  useEffect(() => {
    if (!document) {
      setLoading(true);
      console.log("Document not loaded yet.");
      return;
    }

    setLoading(false);
    console.log("Document loaded:", document);

    if (needsSummaryUpdate()) {
      generateSummary({ documentId })
        .then((updatedDoc) => {
          console.log("Summary generation result:", updatedDoc);
          if (updatedDoc?.summary) {
            setSummary(updatedDoc.summary);
          }
        })
        .catch((err) => {
          console.error("Error generating summary:", err);
          setError("Failed to generate summary.");
        });
    } else if (document.summary) {
      setSummary(document.summary);
    }
  }, [document, documentId, generateSummary, needsSummaryUpdate]);

  return { summary, summarizeText, loading, error };
};

export default useSummarizer;
 */