// hooks\use-document-title.tsx
import { useEffect } from 'react';
import { Document } from '../types/types'; // Adjust the import path if necessary

// Explicitly type the function parameter
export const useDocumentTitle = (document: Document | undefined) => {
  useEffect(() => {
    if (document) {
      // Update the document's title with a prefix
      document.title = `KenDev.co Shared Document - ${document.title}`;
    }
  }, [document]);
};
