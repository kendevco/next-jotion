"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo, useEffect, useState } from "react";
import Head from 'next/head';
import { usePathname } from 'next/navigation';

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/use-document-title";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);
  const pathname = usePathname();
  const [fullUrl, setFullUrl] = useState<string>('');

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  });

  useDocumentTitle(document, "KenDev Jotion •");  // Updated prefix with the circle glyph

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const host = window.location.host;
      setFullUrl(`${protocol}//${host}${pathname}`);
    }
  }, [pathname]);

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

  if (document === null) {
    return <div>Not found</div>
  }

  const title = `KenDev Jotion • ${document.title}`;
  const description = document.content ? document.content.substring(0, 200) : "No content available";
  const defaultImage = "/documents.png";  // Ensure this default Jotion image exists in your public folder
  const imageUrl = document.coverImage || defaultImage;
  const faviconUrl = document.icon || "/favicon.ico";

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href={faviconUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={fullUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={imageUrl} />
      </Head>
      <div className="pb-40">
        <Cover url={document.coverImage} />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
          <Toolbar initialData={document} />
          <Editor
            onChange={onChange}
            initialContent={document.content}
          />
        </div>
      </div>
    </>
  );
}

export default DocumentIdPage;