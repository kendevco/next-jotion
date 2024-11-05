// components/modals/document-properties-modal.tsx

"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useMutation, useQuery } from "convex/react";
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Id } from '@/convex/_generated/dataModel';
import { ParentSelector } from "@/components/parentselector";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageIcon, X } from "lucide-react";
import { IconPicker } from "@/components/icon-picker";
import { Cover } from "@/components/cover";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DocumentPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: Id<"documents">;
}

export const DocumentPropertiesModal = ({
  isOpen,
  onClose,
  documentId
}: DocumentPropertiesModalProps) => {
  const router = useRouter();
  const document = useQuery(
    api.documents.getById,
    isOpen ? { documentId } : "skip"
  );

  const [title, setTitle] = useState('');
  const [parentDocumentId, setParentDocumentId] = useState<Id<"documents"> | undefined>();
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setParentDocumentId(document.parentDocument);
    }
  }, [document]);

  const updateDocument = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const handleSave = async () => {
    try {
      await updateDocument({
        id: documentId,
        title,
        parentDocument: parentDocumentId,
      });

      toast.success("Document updated successfully");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Failed to update document:", error);
      toast.error("Failed to update document");
    }
  };

  const onIconSelect = async (icon: string) => {
    try {
      await updateDocument({
        id: documentId,
        icon,
      });
      toast.success("Icon updated");
      setIsIconPickerOpen(false);
    } catch {
      toast.error("Failed to update icon");
    }
  };

  const onRemoveIcon = async () => {
    try {
      await removeIcon({
        id: documentId
      });
      toast.success("Icon removed");
    } catch {
      toast.error("Failed to remove icon");
    }
  };

  const onRemoveCover = async () => {
    try {
      await removeCoverImage({
        id: documentId
      });
      toast.success("Cover image removed");
    } catch {
      toast.error("Failed to remove cover image");
    }
  };

  if (!isOpen) return null;
  if (!document) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Properties</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse bg-muted rounded" />
            <div className="h-8 w-full animate-pulse bg-muted rounded" />
            <div className="h-8 w-full animate-pulse bg-muted rounded" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const createdDate = document._creationTime
    ? new Date(document._creationTime).toLocaleString()
    : 'Unknown';

  const lastUpdatedDate = document.lastUpdated
    ? new Date(document.lastUpdated).toLocaleString()
    : 'Unknown';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Document Properties</DialogTitle>
          <DialogDescription>Update the properties of the document.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative w-full">
            <Cover 
              url={document.coverImage} 
              preview 
              className="h-[20vh]"
              onChange={(url: string) => {
                updateDocument({
                  id: documentId,
                  coverImage: url,
                });
                toast.success("Cover image updated");
              }} 
            />
            {document.coverImage && (
              <div className="absolute right-5 top-5">
                <ShadcnButton
                  onClick={onRemoveCover}
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground text-xs"
                >
                  <X className="h-4 w-4" />
                </ShadcnButton>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <div className="relative">
                {document.icon ? (
                  <div className="group relative">
                    <button
                      onClick={() => setIsIconPickerOpen(true)}
                      className="h-[45px] w-[45px] bg-muted rounded-md p-2 flex items-center justify-center"
                    >
                      {document.icon}
                    </button>
                    <button
                      onClick={onRemoveIcon}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsIconPickerOpen(true)}
                    className="h-[45px] w-[45px] bg-muted rounded-md p-2 flex items-center justify-center"
                  >
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
                {isIconPickerOpen && (
                  <div className="absolute top-full left-0 mt-2 z-[99]">
                    <IconPicker onChange={onIconSelect}>
                      <div className="p-2 w-full h-full" />
                    </IconPicker>
                  </div>
                )}
              </div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1"
              />
            </div>
            <Separator />
            <div>
              <Label>Parent Document</Label>
              <ParentSelector
                value={parentDocumentId}
                onChange={setParentDocumentId}
                currentDocumentId={documentId}
              />
            </div>
            <div>
              <Label>Created</Label>
              <p className="text-sm text-muted-foreground">
                {createdDate}
              </p>
            </div>
            <div>
              <Label>Last Updated</Label>
              <p className="text-sm text-muted-foreground">
                {lastUpdatedDate}
              </p>
            </div>
          </div>
        </div>
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
};