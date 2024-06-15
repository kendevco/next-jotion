// components/document-list.tsx
'use client';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Item from './item';
import { FileIcon } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';

interface Document {
  _id: Id<'documents'>;
  title: string;
  icon?: string;
  parentDocument?: Id<'documents'>;
}

export const DocumentList = ({ parentDocumentId, level = 0 }: { parentDocumentId?: Id<'documents'>; level?: number }) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const updateDocument = useMutation(api.documents.update);
  const documents = useQuery(api.documents.getSidebar, { parentDocument: parentDocumentId });

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    await updateDocument({
      id: draggableId as Id<'documents'>,
      parentDocument: destination.droppableId ? (destination.droppableId as Id<'documents'>) : undefined,
    });
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={parentDocumentId || 'root'}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {documents.sort((a, b) => a.title.localeCompare(b.title)).map((document: Document, index: number) => (
              <Draggable key={document._id} draggableId={document._id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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

export default DocumentList;