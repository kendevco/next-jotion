"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
import { FileIcon, ChevronDown, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

interface PublicItemProps {
  label: string;
  onClick?: () => void;
  icon: any;
  documentIcon?: string;
  active?: boolean;
  level?: number;
  onExpand?: () => void;
  expanded?: boolean;
}

const PublicItem = ({
  label,
  onClick,
  icon: Icon,
  documentIcon,
  active,
  level = 0,
  onExpand,
  expanded,
}: PublicItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ 
        paddingLeft: level ? `${(level * 12) + 12}px` : "12px"
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!onExpand && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
          <ChevronIcon
            className="h-4 w-4 shrink-0 text-muted-foreground/50"
          />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">
          {documentIcon}
        </div>
      ) : (
        <Icon 
          className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"
        />
      )}
      <span className="truncate">
        {label}
      </span>
    </div>
  );
};

const PublicItemSkeleton = ({ level }: { level?: number }) => {
  return (
    <div
      style={{
        paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export const PublicDocumentList = ({
  parentDocumentId,
  level = 0
}: {
  parentDocumentId?: Id<"documents">;
  level?: number;
}) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }));
  };

  const documents = useQuery(api.documents.getPublishedSidebar, {
    parentDocument: parentDocumentId
  });

  const onRedirect = (documentId: string) => {
    router.push(`/preview/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <PublicItemSkeleton level={level} />
        {level === 0 && (
          <>
            <PublicItemSkeleton level={level} />
            <PublicItemSkeleton level={level} />
          </>
        )}
      </>
    );
  }

  if (!documents?.length) {
    return (
      <p
        style={{
          paddingLeft: level ? `${(level * 12) + 25}px` : undefined
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No published pages
      </p>
    );
  }

  return (
    <div>
      {documents
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((document) => (
          <div key={document._id}>
            <PublicItem
              onClick={() => onRedirect(document._id)}
              label={document.title}
              icon={FileIcon}
              documentIcon={document.icon}
              active={params.documentId === document._id}
              level={level}
              onExpand={() => onExpand(document._id)}
              expanded={expanded[document._id]}
            />
            {expanded[document._id] && (
              <PublicDocumentList
                parentDocumentId={document._id}
                level={level + 1}
              />
            )}
          </div>
        ))}
    </div>
  );
};
