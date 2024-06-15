"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { Workspace, UserProfile } from "@/types/types";
import axios from "axios";

const WorkspaceItem = ({ workspace }: { workspace: Workspace }) => (
  <div className="flex flex-col gap-y-1">
    <Label>{workspace.name}</Label>
    <span className="text-[0.8rem] text-muted-foreground">
      Owner: {workspace.ownerId}
    </span>
  </div>
);

export const SettingsModal = () => {
  const settings = useSettings();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  useEffect(() => {
    const updatedProfiles = settings.userProfiles.map((profile: UserProfile) => ({
      ...profile,
      displayName: profile.displayName || "Default Name",
    }));
    setProfiles(updatedProfiles);
  }, [settings.userProfiles]);

  const addWorkspace = async () => {
    try {
      await axios.post("/api/workspaces", {
        name: newWorkspaceName,
        ownerId: "defaultOwnerId", // replace with actual owner ID
      });
      settings.fetchWorkspaces();
      setNewWorkspaceName("");
    } catch (error) {
      console.error("Failed to add workspace:", error);
    }
  };

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Jotion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
        <div className="mt-4">
          <h3 className="text-md font-medium">Workspaces</h3>
          {settings.workspaces.map((workspace) => (
            <WorkspaceItem key={workspace.id} workspace={workspace} />
          ))}
          <div className="mt-2 flex items-center">
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="New workspace name"
              className="input input-bordered w-full max-w-xs"
            />
            <button onClick={addWorkspace} className="btn btn-primary ml-2">
              Add
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-medium">User Profiles</h3>
          {profiles.map((profile) => (
            <div key={profile._id} className="flex flex-col gap-y-1">
              <Label>{profile.displayName}</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                Email: {profile.email}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
