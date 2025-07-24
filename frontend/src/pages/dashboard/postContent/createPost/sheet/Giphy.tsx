import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMedia } from "@/context/MediaContext"; // Adjust path as needed

interface GifResult {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
    };
  };
}

const GiphyGallery = () => {
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("funny");
  const [inputValue, setInputValue] = useState("funny");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Media context integration
  const { selectedImages, addImage, deleteImage, reorderImages } = useMedia();

  // Drag and drop refs for selected GIFs
  const dragGifIndex = useRef<number | null>(null);
  const dragOverGifIndex = useRef<number | null>(null);

  const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
  const limit = 12;

  const fetchGifs = async (query: string, pageNum: number) => {
    try {
      setError("");
      setLoading(true);
      const offset = (pageNum - 1) * limit;
      const res = await axios.get("https://api.giphy.com/v1/gifs/search", {
        params: {
          api_key: GIPHY_API_KEY,
          q: query,
          limit,
          offset,
        },
      });

      const results = res.data.data || [];
      setGifs(results);

      const totalCount = res.data.pagination.total_count || 0;
      setTotalPages(Math.ceil(totalCount / limit));

      if (results.length === 0) {
        setError("No GIFs found.");
      }
    } catch (err) {
      console.error("Giphy fetch error:", err);
      setError("Failed to load GIFs.");
      setGifs([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifs(searchTerm, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchGifs(searchTerm, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Add GIF to media context instead of local state
  const addGif = (gif: GifResult) => {
    // Check if GIF is already selected
    if (
      !selectedImages.find((img) => img.url === gif.images.fixed_height.url)
    ) {
      addImage(gif.images.fixed_height.url, gif.title || `GIF ${gif.id}`);
    }
  };

  // Drag and drop handlers for reordering selected images
  const onGifDragStart = (index: number) => {
    dragGifIndex.current = index;
  };

  const onGifDragEnter = (index: number) => {
    dragOverGifIndex.current = index;
  };

  const onGifDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onGifDragEnd = () => {
    const from = dragGifIndex.current;
    const to = dragOverGifIndex.current;

    if (from === null || to === null || from === to) return;

    reorderImages(from, to);

    dragGifIndex.current = null;
    dragOverGifIndex.current = null;
  };

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl bg-white p-6 text-black">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 flex items-center gap-2">
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Search Giphy GIFs..."
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

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      ) : (
        <>
          {/* Error Message */}
          {error && gifs.length === 0 && (
            <div className="mb-4 text-sm text-red-600">{error}</div>
          )}

          {/* GIFs Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {gifs.map((gif) => {
              const isSelected = selectedImages.some(
                (img) => img.url === gif.images.fixed_height.url,
              );

              return (
                <div
                  key={gif.id}
                  className={`group relative overflow-hidden rounded-lg shadow transition hover:shadow-lg ${
                    isSelected ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <img
                    src={gif.images.fixed_height.url}
                    alt={gif.title}
                    className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={() => addGif(gif)}
                    className={`absolute inset-0 flex items-center justify-center font-semibold text-white opacity-0 transition group-hover:opacity-100 ${
                      isSelected
                        ? "bg-blue-500/70"
                        : "bg-black/50 hover:bg-black/70"
                    }`}
                  >
                    {isSelected ? "Added" : "Use"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
        </>
      )}

      {/* Selected Images Section */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold">
          Selected Media ({selectedImages.length})
        </h2>
        {selectedImages.length === 0 ? (
          <p className="text-gray-500">No images selected yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {selectedImages.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => onGifDragStart(index)}
                onDragEnter={() => onGifDragEnter(index)}
                onDragOver={onGifDragOver}
                onDragEnd={onGifDragEnd}
                className="group relative cursor-move overflow-hidden rounded-lg border shadow-lg"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-32 w-full object-cover"
                />

                {/* Index Badge */}
                <div className="absolute top-1 left-1 rounded bg-black/70 px-1 text-xs text-white">
                  {index + 1}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteImage(image.id)}
                  className="absolute top-1 right-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white transition-colors hover:bg-red-700"
                >
                  ×
                </button>

                {/* Drag Handle */}
                <div className="absolute right-1 bottom-1 rounded bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1-.001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1-.001 4.001A2 2 0 0 1 13 14z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GiphyGallery;
