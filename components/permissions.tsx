"use client";

import * as React from "react";
import { User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface UserProfile {
  userId: string;
  displayName: string;
  permission?: string;
}

type OnPermissionChange = (userId: string, permission: string) => void;

interface PermissionsControlProps {
  userProfiles: UserProfile[];
  permissions: string[];
  onPermissionChange: OnPermissionChange;
}

export default function PermissionsControl({ userProfiles, permissions, onPermissionChange }: PermissionsControlProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      {userProfiles.map((user) => (
        <div key={user.userId} className="flex items-center justify-between rounded-md border px-4 py-3">
          <span className="text-sm font-medium">{user.displayName}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                <User className="h-4 w-4" />
                {user.permission || 'Set Permission'}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {permissions.map((perm) => (
                <DropdownMenuItem key={perm} onSelect={() => onPermissionChange(user.userId, perm)}>
                  {perm}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}