// components/metadata-display.tsx
import React, { useState } from "react";

// Interface for the component's props
interface MetadataProps {
  title: string;
  description: string;
  openGraph?: {
    title: string;
    description: string;
    images: string[];
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
}

const MetadataDisplay: React.FC<MetadataProps> = ({
  title,
  description,
  openGraph,
  twitter,
}) => {
  const [showMetadata, setShowMetadata] = useState(false);

  const toggleMetadataDisplay = () => setShowMetadata(!showMetadata);

  return (
    <div>
      <button onClick={toggleMetadataDisplay} style={styles.button}>
        {showMetadata ? "Hide Metadata" : "Show Metadata"}
      </button>

      {showMetadata && (
        <div style={styles.metadataContainer}>
          <h3>Metadata Information</h3>
          <div>
            <strong>Title:</strong> {title}
          </div>
          <div>
            <strong>Description:</strong> {description}
          </div>
          {openGraph && (
            <div>
              <h4>Open Graph</h4>
              <div>
                <strong>OG Title:</strong> {openGraph.title}
              </div>
              <div>
                <strong>OG Description:</strong> {openGraph.description}
              </div>
              <div>
                <strong>OG Images:</strong> {openGraph.images.join(", ")}
              </div>
            </div>
          )}
          {twitter && (
            <div>
              <h4>Twitter Card</h4>
              <div>
                <strong>Card Type:</strong> {twitter.card}
              </div>
              <div>
                <strong>Twitter Title:</strong> {twitter.title}
              </div>
              <div>
                <strong>Twitter Description:</strong> {twitter.description}
              </div>
              <div>
                <strong>Twitter Images:</strong> {twitter.images.join(", ")}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  button: {
    padding: "10px 15px",
    margin: "10px 0",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  metadataContainer: {
    padding: "15px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginTop: "10px",
  },
};

export default MetadataDisplay;
