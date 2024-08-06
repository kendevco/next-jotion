import { Metadata } from 'next'
import { api } from "@/convex/_generated/api";
import DocumentIdPage from './client'
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({ params }: { params: { documentId: string } }): Promise<Metadata> {
  const document = await convex.query(api.documents.getById, { documentId: params.documentId as Id<"documents"> });


  if (!document) {
    return {
      title: 'Document Not Found'
    }
  }

  const title = `KenDev Shared Document - ${document.title}`;
  const description = document.content
    ? document.content.substring(0, 200)
    : "No content available";
  const defaultImage = "/default-og-image.png";
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
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default function Page({ params }: { params: { documentId: string } }) {
  return <DocumentIdPage params={{ documentId: params.documentId as Id<"documents"> }} />
}
