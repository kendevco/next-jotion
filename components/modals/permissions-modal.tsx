// components/modals/permissions-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserProfile, Workspace } from "@/types/types"; // Ensure correct import
import { Id } from "@/convex/_generated/dataModel"; // Ensure Id type is imported from the correct module
import axios from "axios";
import { DocumentList } from "@/components/document-list"; // Import DocumentList component

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: Id<"workspaces">; // Ensure correct type for workspaceId
}

export const PermissionsModal = ({ isOpen, onClose, workspaceId }: PermissionsModalProps) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await axios.get(`/api/workspaces/${workspaceId}`);
        setWorkspace(response.data);
      } catch (error) {
        console.error("Error fetching workspace:", error);
      }
    };
    const fetchUserProfiles = async () => {
      try {
        const response = await axios.get("/api/userProfiles");
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };
    if (isOpen) {
      fetchWorkspace();
      fetchUserProfiles();
    }
  }, [isOpen, workspaceId]);

  const handlePermissionChange = async (userId: string, permission: string) => {
    try {
      await axios.post("/api/workspaces/updatePermissions", {
        workspaceId,
        userId,
        permission,
      });
      const response = await axios.get(`/api/workspaces/${workspaceId}`);
      setWorkspace(response.data);
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>Manage permissions for the selected workspace.</DialogDescription>
        </DialogHeader>
        {workspace && (
          <div>
            <h3>Workspace: {workspace.name}</h3>
            <div>
              {profiles.map((profile) => (
                <div key={profile.userId} className="flex items-center justify-between">
                  <span>{profile.displayName}</span>
                  <select
                    title="Permission"
                    value={workspace.members.find((member) => member.userId === profile.userId)?.permission || "none"}
                    onChange={(e) => handlePermissionChange(profile.userId, e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ))}
            </div>
            <div>
              <h4>Reassign Document Parent</h4>
              <DocumentList parentDocumentId={workspace.id as Id<"documents">} /> {/* Ensure correct type */}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};