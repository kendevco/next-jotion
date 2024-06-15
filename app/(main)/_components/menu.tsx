// app\(main)\_components\menu.tsx

"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { MoreHorizontal, Trash } from "lucide-react";

// Import necessary dependencies and components
import { useState } from 'react';
import { DocumentPropertiesModal } from '@/components/modals/document-properties-modal'; // Adjust the import path


import { Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuProps {
  documentId: Id<"documents">;
};

export const Menu = ({
  documentId
}: MenuProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.documents.archive);

  const onArchive = () => {
    const promise = archive({ id: documentId })

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note."
    });

    router.push("/documents");
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-60" 
          align="end" 
          alignOffset={8} 
          forceMount
        >
          <DropdownMenuItem onClick={onArchive}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openModal}>
            <MoreHorizontal className="h-4 w-4 mr-2" />
            Properties
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="text-xs text-muted-foreground p-2">
            Last edited by: {user?.fullName}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <DocumentPropertiesModal
        isOpen={isModalOpen}
        onClose={closeModal}
        documentId={documentId}
      />
    </>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return (
    <Skeleton className="h-10 w-10" />
  )
}