"use client";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { FileIcon } from "lucide-react";
import { toast } from "sonner";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Item } from "./item";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

export const DocumentList = ({
  parentDocumentId,
  level = 0
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const updateDocument = useMutation(api.documents.update);

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }));
  };

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    
    try {
      await updateDocument({
        id: draggableId as Id<"documents">,
        parentDocument: destination.droppableId === "root" 
          ? undefined 
          : destination.droppableId as Id<"documents">
      });
      
      toast.success("Document moved successfully");
      router.refresh(); // Refresh the page to show updated navigation
    } catch (error) {
      console.error("Failed to move document:", error);
      toast.error("Failed to move document");
    }
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
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
        No pages inside
      </p>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={parentDocumentId || "root"}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef} 
            {...provided.droppableProps}
            className={cn(
              "min-h-[4px]",
              snapshot.isDraggingOver && "bg-primary/5"
            )}
          >
            {documents
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((document, index) => (
                <Draggable 
                  key={document._id} 
                  draggableId={document._id} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        snapshot.isDragging && "opacity-50"
                      )}
                    >
                      <div 
                        {...provided.dragHandleProps}
                        className={cn(
                          "rounded-lg hover:bg-primary/5",
                          snapshot.isDragging && "bg-primary/5 shadow-md"
                        )}
                      >
                        <Item
                          id={document._id}
                          onClick={() => onRedirect(document._id)}
                          label={document.title}
                          icon={FileIcon}
                          documentIcon={document.icon}
                          active={params.documentId === document._id}
                          level={level}
                          onExpand={() => onExpand(document._id)}
                          expanded={expanded[document._id]}
                        />
                      </div>
                      {expanded[document._id] && (
                        <DocumentList
                          parentDocumentId={document._id}
                          level={level + 1}
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
