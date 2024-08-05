// app\(main)\(routes)\documents\page.tsx

"use client";

import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Id } from "@/convex/_generated/dataModel";

interface Workspace {
  _id: Id<"workspaces">;
  _creationTime: number;
  userId: string;
  authorizedUsers: { userId: string; permission: string }[];
}

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const createDocument = useMutation(api.documents.create);
  const getOrCreateWorkspace = useMutation(api.workspaces.getOrCreateUserWorkspace);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      const ws = await getOrCreateWorkspace();
      setWorkspace(ws);
    };
    fetchWorkspace();
  }, [getOrCreateWorkspace]);

  const onCreate = () => {
    if (!workspace) return; // Handle case where workspace is not yet loaded
    const promise = createDocument({ title: "New Document", workspaceId: workspace._id }).then(
      (documentId) => router.push(`/documents/${documentId}`)
    );
    toast.promise(promise, {
      loading: "Creating...",
      success: "Document created!",
      error: "Error creating document",
    });
  };

  // Prepare dynamic metadata
  const pageTitle = `${user?.firstName || "User"}'s Documents - KenDev Jotion`;
  const pageDescription = `Welcome to ${user?.firstName || "User"}'s Jotion, where you can create and manage your documents effortlessly.`;
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <Head key="head-metadata">
        <title key="title">{pageTitle}</title>
        <meta key="description" name="description" content={pageDescription} />
        <meta key="og-title" property="og:title" content={pageTitle} />
        <meta key="og-description" property="og:description" content={pageDescription} />
        <meta key="og-url" property="og:url" content={pageUrl} />
        <meta key="og-type" property="og:type" content="website" />
        <meta key="og-image" property="og:image" content="/path/to/your/image.jpg" />
        <meta key="twitter-card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter-title" property="twitter:title" content={pageTitle} />
        <meta key="twitter-description" property="twitter:description" content={pageDescription} />
        <meta key="twitter-image" property="twitter:image" content="/path/to/your/image.jpg" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h2 className="text-2xl font-bold mb-4">
          Welcome to {user?.firstName || "User"}&apos;s Jotion
        </h2>
        <Button onClick={onCreate}>
          <PlusCircle className="mr-2" />
          Create a note
        </Button>
      </div>
    </>
  );
};

export default DocumentsPage;
