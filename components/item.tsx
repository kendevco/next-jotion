import React, { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component
import styles from './item.module.css'; // Import the CSS module

interface ItemProps {
  id: string;
  label: string;
  icon: React.ElementType;
  documentIcon?: string;
  active?: boolean;
  level?: number;
  onClick?: () => void;
  onExpand?: () => void;
  expanded?: boolean;
}

const Item: FC<ItemProps> & { Skeleton: FC<{ level?: number }> } = ({
  id,
  label,
  icon: Icon,
  documentIcon,
  active,
  level = 0,
  onClick,
  onExpand,
  expanded,
}) => {
  return (
    <div onClick={onClick} role="button" className={styles.item} style={{ paddingLeft: level ? `${(level * 12) + 12}px` : undefined }}>
      {documentIcon ? (
        <div>{documentIcon}</div>
      ) : (
        <Icon />
      )}
      <span>{label}</span>
    </div>
  );
};

Item.Skeleton = ({ level }: { level?: number }) => (
  <div className={styles.skeleton} style={{ paddingLeft: level ? `${(level * 12) + 25}px` : undefined }}>
    <Skeleton />
  </div>
);

// Add display name
Item.displayName = 'Item';
Item.Skeleton.displayName = 'Item.Skeleton';

export default Item;