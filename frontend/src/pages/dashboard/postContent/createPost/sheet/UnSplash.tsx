import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useMedia } from "@/context/MediaContext";

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

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    full: string;
    regular: string;
    [key: string]: string;
  };
  alt_description: string | null;
  links: {
    html: string;
    [key: string]: string;
  };
}

const UnsplashGallery: React.FC = () => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const UNSPLASH_API = import.meta.env.VITE_UNSPLASH_API;
  const CLIENT_ID = import.meta.env.VITE_UNSPLASH_CLIENT_ID;

  const perPage = 12;
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  const isDraggingFromUnsplash = useRef(false);

  const { selectedImages, addImage, deleteImage, reorderImages } = useMedia();

  const fetchImages = async (query: string, pageNum: number): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(UNSPLASH_API, {
        params: {
          client_id: CLIENT_ID,
          query,
          page: pageNum,
          per_page: perPage,
        },
      });

      const results = res.data.results || [];
      setImages(results);

      if (results.length === 0) {
        setError("Images not found.");
      }

      setTotalPages(Math.ceil(res.data.total / perPage));
    } catch (err) {
      console.error("Unsplash fetch error:", err);
      setError("Failed to load images. Please try again later.");
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
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchImages(searchTerm, page);
    }
  }, [searchTerm, page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchTerm(inputValue.trim());
      setPage(1);
    }
  };

  const goToPage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Drag and drop handlers
  const onDragStart = (index: number, isUnsplash: boolean) => {
    dragItemIndex.current = index;
    isDraggingFromUnsplash.current = isUnsplash;
  };

  const onDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDragEnd = () => {
    const from = dragItemIndex.current;
    const to = dragOverItemIndex.current;

    // Handle Unsplash drag to selected images
    if (isDraggingFromUnsplash.current && from !== null) {
      const targetIndex = to !== null ? to : selectedImages.length;
      const img = images[from];
      addImage(
        img.urls.small,
        img.alt_description || "Unsplash image",
        targetIndex,
      );
    }
    // Handle reordering of selected images
    else if (
      !isDraggingFromUnsplash.current &&
      from !== null &&
      to !== null &&
      from !== to
    ) {
      reorderImages(from, to);
    }

    // Reset references
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    isDraggingFromUnsplash.current = false;
  };

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl bg-white p-6 text-black">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex items-center gap-2">
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Search images..."
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
      {error && images.length === 0 && !loading && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      {/* Loader */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />
        </div>
      )}

      {/* Images Grid */}
      {!loading && (
        <div>
          <h3 className="mb-3 text-lg font-semibold">Unsplash Results</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-lg shadow transition hover:shadow-lg"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                draggable
                onDragStart={() => onDragStart(index, true)}
                onDragEnd={onDragEnd}
              >
                <a
                  href={img.links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={img.urls.small}
                    alt={img.alt_description || "Unsplash image"}
                    className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </a>

                {hoveredIndex === index && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <button
                      onClick={() =>
                        addImage(
                          img.urls.small,
                          img.alt_description || "Unsplash image",
                        )
                      }
                      className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                      type="button"
                      aria-label={`Use image ${img.alt_description || "Unsplash image"}`}
                    >
                      Use
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
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

      {/* Selected Images Preview Section */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold">Selected Images</h2>
        {selectedImages.length === 0 && (
          <p className="text-gray-500">
            No images selected yet. Drag images from above or click "Use".
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {selectedImages.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStart(index, false)}
              onDragEnter={() => onDragEnter(index)}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              className="relative cursor-move overflow-hidden rounded-lg border shadow-lg"
              aria-label={`Selected image preview ${img.alt}`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="h-32 w-full object-cover"
              />
              <div className="absolute top-1 left-1 rounded bg-black/70 px-1 text-xs text-white">
                {index + 1}
              </div>
              <button
                onClick={() => deleteImage(img.id)}
                aria-label={`Delete selected image ${img.alt}`}
                className="absolute top-1 right-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white hover:bg-red-700"
                type="button"
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

export default UnsplashGallery;
