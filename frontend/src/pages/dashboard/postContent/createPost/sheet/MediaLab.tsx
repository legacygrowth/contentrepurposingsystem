import React, { useRef, useState } from "react";
import { useMedia } from "../../../../../context/MediaContext";

const MediaLab: React.FC = () => {
  const images = [
    "/dashboard/media-library/image1.jpg",
    "/dashboard/media-library/image2.jpg",
    "/dashboard/media-library/image3.jpg",
    "/dashboard/media-library/image4.jpg",
    "/dashboard/media-library/image5.jpg",
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  const isDraggingFromMediaLab = useRef(false);

  const { selectedImages, addImage, deleteImage, reorderImages } = useMedia();

  const onDragStart = (index: number, isMediaLab: boolean) => {
    dragItemIndex.current = index;
    isDraggingFromMediaLab.current = isMediaLab;
  };

  const onDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // This is crucial for drop to work
  };

  const onDragEnd = () => {
    const from = dragItemIndex.current;
    const to = dragOverItemIndex.current;

    // Handle media library drag to selected images
    if (isDraggingFromMediaLab.current && from !== null) {
      const targetIndex = to !== null ? to : selectedImages.length;
      addImage(images[from], `Media ${from + 1}`, targetIndex);
    }
    // Handle reordering of selected images
    else if (
      !isDraggingFromMediaLab.current &&
      from !== null &&
      to !== null &&
      from !== to
    ) {
      reorderImages(from, to);
    }

    // Reset references
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    isDraggingFromMediaLab.current = false;
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Media Library Section */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Media Library</h3>
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              draggable
              onDragStart={() => onDragStart(index, true)}
              onDragEnd={onDragEnd}
            >
              <img
                src={img}
                alt={`Media ${index + 1}`}
                className="h-24 w-full object-cover"
              />
              {hoveredIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <button
                    onClick={() => addImage(img, `Media ${index + 1}`)}
                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    Use
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Images Section */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Selected Images</h3>
        {selectedImages.length === 0 && (
          <p className="py-4 text-center text-gray-500">
            No images selected yet.
          </p>
        )}
        <div className="grid grid-cols-5 gap-2">
          {selectedImages.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStart(index, false)}
              onDragEnter={() => onDragEnter(index)}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              className="relative cursor-move overflow-hidden rounded-lg border shadow-lg transition-shadow hover:shadow-xl"
              aria-label={`Selected image preview ${img.alt}`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="h-24 w-full object-cover"
              />
              <div className="absolute top-1 left-1 rounded bg-black/70 px-1 text-xs text-white">
                {index + 1}
              </div>
              <button
                onClick={() => deleteImage(img.id)}
                className="absolute top-1 right-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white transition-colors hover:bg-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaLab;
