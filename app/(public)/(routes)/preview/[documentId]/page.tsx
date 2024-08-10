import { Metadata } from 'next'
import { api } from "@/convex/_generated/api";
import DocumentIdPage from './client'
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({
  params,
}: {
  params: { documentId: string };
}): Promise<Metadata> {
  try {
    const document = await convex.query(api.documents.getPreviewById, { documentId: params.documentId as Id<"documents"> });

    if (!document) {
      return {
        title: "Document Not Found",
        description: "No description available.",
      };
    }

    const title = `KenDev - ${document.title}`;
    const defaultImage = "/document.png";
    const imageUrl = document.coverImage || defaultImage;

    return {
      title,
      openGraph: {
        title,
        images: [imageUrl],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        images: [imageUrl],
      },
    }

  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error Loading Document",
      description: "An error occurred while loading the document.",
    };
  }
}


export async function generateStaticParams() {
  const documentIds = await convex.query(api.documents.getPublishedDocumentIds);
  return documentIds.map((id) => ({
    documentId: id,
  }));
}

export default function Page({ params }: { params: { documentId: string } }) {
  return <DocumentIdPage params={{ documentId: params.documentId as Id<"documents"> }} />
}
