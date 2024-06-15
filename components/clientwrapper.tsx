// components/clientwrapper.tsx

"use client";

import { ReactNode } from "react";
import { useSyncUserProfile } from "@/hooks/use-sync-user-profile";

interface ClientWrapperProps {
  children: ReactNode;
}

const ClientWrapper = ({ children }: ClientWrapperProps) => {
  useSyncUserProfile();
  return <>{children}</>;
};

export default ClientWrapper;