// hooks/use-settings.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Workspace, UserProfile } from "@/types/types";

interface Settings {
  isOpen: boolean;
  onOpen: () => void; // Add onOpen method
  onClose: () => void;
  workspaces: Workspace[];
  userProfiles: UserProfile[];
  fetchWorkspaces: () => void;
  fetchUserProfiles: () => void;
}

export const useSettings = (): Settings => {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get("/api/workspaces");
      setWorkspaces(response.data);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  const fetchUserProfiles = async () => {
    try {
      const response = await axios.get("/api/userProfiles");
      setUserProfiles(response.data);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
    fetchUserProfiles();
  }, []);

  const onOpen = () => setIsOpen(true); // Define onOpen method
  const onClose = () => setIsOpen(false);

  return {
    isOpen,
    onOpen, // Return onOpen method
    onClose,
    workspaces,
    userProfiles,
    fetchWorkspaces,
    fetchUserProfiles,
  };
};