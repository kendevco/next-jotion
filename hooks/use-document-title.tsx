// hooks\use-document-title.tsx
import { useEffect } from 'react';
import { Id } from '@/convex/_generated/dataModel';

interface DocumentData {
  _id: Id<"documents">;
  title: string;
  icon?: string;
  // Add other properties as needed, based on your schema
}

export const useDocumentTitle = (
  documentData: DocumentData | undefined,
  prefix: string = "KenDev - "
) => {
  useEffect(() => {
    if (documentData) {
      // Update the document's title
      document.title = `${prefix}${documentData.title}`;

      // Update favicon if document has an icon
      if (documentData.icon) {
        const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = documentData.icon;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }
  }, [documentData, prefix]);
};