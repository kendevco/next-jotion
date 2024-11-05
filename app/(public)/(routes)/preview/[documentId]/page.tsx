import { Metadata } from 'next'
import { api } from "@/convex/_generated/api";
import DocumentIdPage from './client'
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";
import { headers } from 'next/headers'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


function getSiteUrl() {
  const headersList = headers()
  const host = headersList.get('host') || process.env.NEXT_PUBLIC_SITE_URL
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${host}`
}
export async function generateMetadata({
  params,
}: {
  params: { documentId: string };
}): Promise<Metadata> {
  const documentId = params.documentId;
  const document = await convex.query(api.documents.getPreviewById, { documentId: documentId as Id<"documents"> });

  if (!document) {
    return {
      title: "Document Not Found",
      description: "No description available.",
    };
  }


  const user = await convex.query(api.userprofile.getUserProfile, { clerkUserId: document.userId });
  const userName = user ? user.displayName : "Someone";

  const title = `${document.title ?? "Untitled"} - Shared Document`;
  const description = `${userName} has shared "${document.title}" with you`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl();
  const defaultImage = `${siteUrl}/documents.png`;
  const imageUrl = document.coverImage || defaultImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}



export async function generateStaticParams() {
  const documentIds: Id<"documents">[] = [];
  let cursor: string | undefined = undefined;
  
  // Define the type for the query result
  interface PublishedDocumentsResult {
    documentIds: Id<"documents">[];
    nextCursor: string | null;
    hasMore: boolean;
  }
  
  // Fetch all published documents in batches
  while (true) {
    const result = await convex.query(api.documents.getPublishedDocumentIds, {
      cursor,
    }) as PublishedDocumentsResult;
    
    if (!result?.documentIds) break;
    documentIds.push(...result.documentIds);
    
    if (!result.hasMore) break;
    cursor = result.nextCursor ?? undefined;
  }

  return documentIds.map((id) => ({
    documentId: id,
  }));
}

export default function Page({ params }: { params: { documentId: string } }) {
  return <DocumentIdPage params={{ documentId: params.documentId as Id<"documents"> }} />
}
