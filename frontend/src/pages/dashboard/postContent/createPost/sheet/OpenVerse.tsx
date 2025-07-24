import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMedia } from "@/context/MediaContext"; // Adjust the import path as needed
import { Eye, Trash, GripVertical } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const searchOptions = [
  "nature",
  "animals",
  "city",
  "technology",
  "cars",
  "flowers",
  "mountains",
  "beach",
  "art",
  "food",
];

const getRandomSearchTerm = () => {
  const randomIndex = Math.floor(Math.random() * searchOptions.length);
  return searchOptions[randomIndex];
};

interface OpenverseImage {
  id: string;
  title: string | null;
  thumbnail: string | null;
  url: string;
  foreign_landing_url: string;
}

const OpenverseGallery = () => {
  const [images, setImages] = useState<OpenverseImage[]>([]);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Use the media context
  const { selectedImages, addImage, deleteImage, reorderImages } = useMedia();

  // For drag and drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const OPENVERSE_API = import.meta.env.VITE_OPENVERSE_API;
  const perPage = 12;

  const fetchImages = async (query: string, pageNum: number): Promise<void> => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.get(OPENVERSE_API, {
        params: {
          q: query,
          page: pageNum,
          page_size: perPage,
          license_type: "all",
        },
      });

      const results = res.data.results || [];
      setImages(results);

      if (results.length === 0) {
        setError("No images found.");
      }

      setTotalPages(Math.ceil(res.data.result_count / perPage));
    } catch (err) {
      console.error("Openverse fetch error:", err);
      setError("Failed to load images.");
      setImages([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const random = getRandomSearchTerm();
    setSearchTerm(random);
    setInputValue(random);
    setPage(1);
    fetchImages(random, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchImages(searchTerm, page);
    }
  }, [searchTerm, page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchTerm(inputValue.trim());
      setPage(1);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleAddImage = (image: OpenverseImage) => {
    const imageUrl = image.thumbnail || image.url;
    const imageAlt = image.title || "Openverse Image";

    // Check if image is already selected
    const isAlreadySelected = selectedImages.some(
      (img) => img.url === imageUrl || img.id === `openverse-${image.id}`,
    );

    if (!isAlreadySelected) {
      // Use a custom ID for Openverse images to avoid conflicts
      addImage(imageUrl, imageAlt);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = selectedImages.findIndex((img) => img.id === active.id);
    const newIndex = selectedImages.findIndex((img) => img.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderImages(oldIndex, newIndex);
    }

    setActiveId(null);
  };

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl bg-white p-6 text-black">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 flex items-center gap-2">
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Search Openverse images..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white transition hover:bg-gray-800"
        >
          Search
        </button>
      </form>

      {/* Error Message */}
      {error && images.length === 0 && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      ) : (
        /* Search Results Grid */
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {images.map((img) => {
            const imageUrl = img.thumbnail || img.url;
            const isSelected = selectedImages.some(
              (selected) => selected.url === imageUrl,
            );

            return (
              <div
                key={img.id}
                className={`group relative overflow-hidden rounded-lg shadow transition hover:shadow-lg ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <img
                  src={imageUrl}
                  alt={img.title || "Openverse image"}
                  className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => handleAddImage(img)}
                  disabled={isSelected}
                  className={`absolute inset-0 flex items-center justify-center font-semibold text-white opacity-0 transition group-hover:opacity-100 ${
                    isSelected
                      ? "cursor-not-allowed bg-green-500/70"
                      : "bg-black/50 hover:bg-black/70"
                  }`}
                >
                  {isSelected ? "✓ Added" : "Use"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 1)
            .map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`rounded px-3 py-1 ${
                  page === p
                    ? "bg-black text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {p}
              </button>
            ))}

          <button
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
            className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Selected Images Section */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold">
          Selected Images ({selectedImages.length})
        </h2>
        {selectedImages.length === 0 ? (
          <p className="text-gray-500">No images selected yet.</p>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={({ active }) => setActiveId(active.id as string)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={selectedImages.map((img) => img.id)}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {selectedImages.map((img, index) => (
                  <SortableSelectedImage
                    key={img.id}
                    image={img}
                    index={index + 1}
                    onDelete={deleteImage}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="relative overflow-hidden rounded-lg opacity-80 shadow-lg">
                  <img
                    src={
                      selectedImages.find((img) => img.id === activeId)?.url ||
                      ""
                    }
                    alt="Dragging"
                    className="h-32 w-full object-cover"
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};

// Sortable Selected Image Component
const SortableSelectedImage = ({
  image,
  index,
  onDelete,
}: {
  image: { id: string; url: string; alt: string };
  index: number;
  onDelete: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-move overflow-hidden rounded-lg border shadow-lg transition-shadow hover:shadow-xl ${
        isDragging ? "scale-105 opacity-50" : ""
      }`}
    >
      <img
        src={image.url}
        alt={image.alt}
        className="h-32 w-full object-cover"
      />

      {/* Index Badge */}
      <div className="absolute top-1 left-1 rounded bg-black/70 px-1 text-xs text-white">
        {index}
      </div>

      {/* Controls */}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // You can add preview functionality here if needed
            }}
            className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
            title="Preview"
          >
            <Eye className="h-4 w-4 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            className="rounded-full bg-white/20 p-2 transition-colors hover:bg-red-500/80"
            title="Remove"
          >
            <Trash className="h-4 w-4 text-white" />
          </button>

          <button
            {...listeners}
            className="cursor-grab rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30 active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OpenverseGallery;
