import React, { createContext, useState, useContext, ReactNode } from "react";

export type ImageItem = {
  id: string;
  url: string;
  alt: string;
};

interface MediaContextType {
  selectedImages: ImageItem[];
  addImage: (url: string, alt?: string, index?: number) => void;
  deleteImage: (id: string) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
  const [nextId, setNextId] = useState(0);

  const addImage = (
    url: string,
    alt: string = "Selected media",
    index?: number,
  ) => {
    const id = `img-${nextId}`;
    const newImage = { id, url, alt };

    setSelectedImages((prev) => {
      // If index is specified and valid, insert at that position
      if (index !== undefined && index >= 0 && index <= prev.length) {
        const newArray = [...prev];
        newArray.splice(index, 0, newImage);
        return newArray;
      } else {
        // Otherwise, append to end
        return [...prev, newImage];
      }
    });

    setNextId((prev) => prev + 1);
  };

  const deleteImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setSelectedImages((prev) => {
      // Validate indices
      if (
        fromIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex < 0 ||
        toIndex >= prev.length
      ) {
        return prev;
      }

      // If indices are the same, no change needed
      if (fromIndex === toIndex) {
        return prev;
      }

      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  return (
    <MediaContext.Provider
      value={{
        selectedImages,
        addImage,
        deleteImage,
        reorderImages,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error("useMedia must be used within MediaProvider");
  return context;
};
