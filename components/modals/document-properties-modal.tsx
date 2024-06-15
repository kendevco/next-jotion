// components/modals/document-properties-modal.tsx

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useMutation } from "convex/react";
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { Id } from '@/convex/_generated/dataModel'; // Import Id type

interface DocumentPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
}

interface Permission {
  userId: string;
  displayName: string;
  permission: string;
}

export const DocumentPropertiesModal = ({ isOpen, onClose, documentId }: DocumentPropertiesModalProps) => {
  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>([]); // Define type for permissions

  useEffect(() => {
    if (isOpen) {
      const fetchDocument = async () => {
        const response = await axios.get(`/api/documents/${documentId}`);
        setDocument(response.data);
        setTitle(response.data.title);
        setPermissions(response.data.permissions || []);
      };
      fetchDocument();
    }
  }, [isOpen, documentId]);

  const updateDocument = useMutation(api.documents.update);

  const handleSave = async () => {
    await updateDocument({ id: documentId as Id<"documents">, title }); // Cast documentId to Id<"documents">
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Document Properties</DialogTitle>
          <DialogDescription>Update the properties of the document.</DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Permissions</Label>
          <ul>
            {permissions.map((permission) => (
              <li key={permission.userId}>{permission.displayName}: {permission.permission}</li>
            ))}
          </ul>
        </div>
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
};