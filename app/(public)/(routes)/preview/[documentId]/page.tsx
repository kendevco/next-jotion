// app/(public)/(routes)/preview/[documentId]/page.tsx
"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo, useEffect, useState } from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@hooks/use-document-title";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  // Dynamically load the Editor component
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );
  const pathname = usePathname();
  const [fullUrl, setFullUrl] = useState<string>("");

  // Fetch the document using Convex query
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  // Set the document title using a custom hook
  useDocumentTitle(document || undefined, "KenDev Shared Document - ");

  // Mutation hook to update the document
  const update = useMutation(api.documents.update);

  // Handler for editor content changes
  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };

  // Use effect to set the full URL of the page
  useEffect(() => {
    if (typeof window !== "undefined") {
      const protocol = window.location.protocol;
      const host = window.location.host;
      setFullUrl(`${protocol}//${host}${pathname}`);
    }
  }, [pathname]);

  // Render skeleton if the document is still loading
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  // Handle the case where the document is not found
  if (document === null) {
    return <div>Not found</div>;
  }

  // Prepare metadata for the document
  const title = `KenDev Shared Document - ${document.title}`;
  const description = document.content
    ? document.content.substring(0, 200)
    : "No content available";
  const defaultImage = "/default-og-image.png"; // Ensure this default image exists in your public folder
  const imageUrl = document.coverImage || defaultImage;
  const faviconUrl = document.icon || "/favicon.ico";

  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <link rel="icon" href={faviconUrl} key="favicon" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" key="og-type" />
        <meta property="og:url" content={fullUrl} key="og-url" />
        <meta property="og:title" content={title} key="og-title" />
        <meta property="og:description" content={description} key="og-description" />
        <meta property="og:image" content={imageUrl} key="og-image" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" key="twitter-card" />
        <meta property="twitter:url" content={fullUrl} key="twitter-url" />
        <meta property="twitter:title" content={title} key="twitter-title" />
        <meta property="twitter:description" content={description} key="twitter-description" />
        <meta property="twitter:image" content={imageUrl} key="twitter-image" />
      </Head>
      <div className="pb-40">
        {document.coverImage && ( // Only render the Cover component if there's a cover image
          <Cover preview url={document.coverImage} />
        )}
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
          <Toolbar preview initialData={document} />
          <Editor editable={false} onChange={onChange} initialContent={document.content} />
        </div>
      </div>
    </>
  );
};

export default DocumentIdPage;
