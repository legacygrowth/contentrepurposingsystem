import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMedia } from "@/context/MediaContext";

const PixabayGallery = () => {
  const sampleQueries = [
    "yellow flowers",
    "nature",
    "city",
    "ocean",
    "mountains",
    "cats",
    "dogs",
    "technology",
    "food",
    "travel",
  ];

  const [imageQuery, setImageQuery] = useState("");
  const [videoQuery, setVideoQuery] = useState("");

  const [images, setImages] = useState<Image[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  const [imagePage, setImagePage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);

  const [imageTotal, setImageTotal] = useState(0);
  const [videoTotal, setVideoTotal] = useState(0);

  const [selectedVideos, setSelectedVideos] = useState<Video[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  const isDraggingFromPixabay = useRef(false);

  const IMAGE_API = import.meta.env.VITE_PIXABAY_IMAGE_API;
  const VIDEO_API = import.meta.env.VITE_PIXABAY_VIDEO_API;
  const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

  const { selectedImages, addImage, deleteImage, reorderImages } = useMedia();

  const getRandomQuery = () =>
    sampleQueries[Math.floor(Math.random() * sampleQueries.length)];

  const fetchImages = async () => {
    if (!imageQuery) return;
    try {
      const res = await axios.get(
        `${IMAGE_API}?key=${API_KEY}&q=${encodeURIComponent(
          imageQuery,
        )}&image_type=photo&page=${imagePage}&per_page=12`,
      );
      setImages(res.data.hits);
      setImageTotal(res.data.totalHits);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchVideos = async () => {
    if (!videoQuery) return;
    try {
      const res = await axios.get(
        `${VIDEO_API}?key=${API_KEY}&q=${encodeURIComponent(
          videoQuery,
        )}&page=${videoPage}&per_page=12`,
      );
      setVideos(res.data.hits);
      setVideoTotal(res.data.totalHits);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    const randomImageQuery = getRandomQuery();
    const randomVideoQuery = getRandomQuery();

    setImageQuery(randomImageQuery);
    setVideoQuery(randomVideoQuery);

    setImagePage(1);
    setVideoPage(1);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [imageQuery, imagePage]);

  useEffect(() => {
    fetchVideos();
  }, [videoQuery, videoPage]);

  const totalImagePages = Math.ceil(imageTotal / 12);
  const totalVideoPages = Math.ceil(videoTotal / 12);

  const handleUseVideo = (video: Video) => {
    if (!selectedVideos.find((v) => v.id === video.id)) {
      setSelectedVideos((prev) => [...prev, video]);
    }
  };

  // Drag and drop handlers
  const onDragStart = (index: number, isPixabay: boolean) => {
    dragItemIndex.current = index;
    isDraggingFromPixabay.current = isPixabay;
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

    // Handle Pixabay drag to selected images
    if (isDraggingFromPixabay.current && from !== null) {
      const targetIndex = to !== null ? to : selectedImages.length;
      addImage(images[from].webformatURL, images[from].tags, targetIndex);
    }
    // Handle reordering of selected images
    else if (
      !isDraggingFromPixabay.current &&
      from !== null &&
      to !== null &&
      from !== to
    ) {
      reorderImages(from, to);
    }

    // Reset references
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    isDraggingFromPixabay.current = false;
  };

  interface Image {
    id: string | number;
    webformatURL: string;
    tags: string;
  }

  interface VideoFile {
    quality: string;
    link: string;
  }

  interface Video {
    id: string;
    video_files: VideoFile[];
    videos: {
      medium: {
        url: string;
      };
    };
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        {/* Images Tab */}
        <TabsContent value="images">
          <div className="mb-4 flex gap-2">
            <Input
              value={imageQuery}
              onChange={(e) => setImageQuery(e.target.value)}
              placeholder="Search images..."
              className="flex-1"
            />
            <Button
              onClick={() => {
                setImagePage(1);
                fetchImages();
              }}
            >
              Search
            </Button>
          </div>

          {/* Pixabay Image Results */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Pixabay Results</h3>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="relative cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  draggable
                  onDragStart={() => onDragStart(index, true)}
                  onDragEnd={onDragEnd}
                >
                  <img
                    src={img.webformatURL}
                    alt={img.tags}
                    className="h-36 w-full object-cover"
                  />
                  {hoveredIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <button
                        onClick={() => addImage(img.webformatURL, img.tags)}
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

          {/* Selected Images */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Selected Images</h3>
            {selectedImages.length === 0 && (
              <p className="py-4 text-center text-gray-500">
                No images selected yet. Drag images from above or click "Use".
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                    className="h-36 w-full object-cover"
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

          {totalImagePages > 1 && (
            <div className="mt-4 flex justify-center gap-4">
              <Button
                variant="outline"
                disabled={imagePage === 1}
                onClick={() => setImagePage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="self-center">
                Page {imagePage} of {totalImagePages}
              </span>
              <Button
                variant="outline"
                disabled={imagePage === totalImagePages}
                onClick={() => setImagePage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos">
          <div className="mb-4 flex gap-2">
            <Input
              value={videoQuery}
              onChange={(e) => setVideoQuery(e.target.value)}
              placeholder="Search videos..."
              className="flex-1"
            />
            <Button
              onClick={() => {
                setVideoPage(1);
                fetchVideos();
              }}
            >
              Search
            </Button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="relative overflow-hidden rounded-lg shadow"
              >
                <video controls className="h-36 w-full object-cover">
                  <source src={video.videos.medium.url} type="video/mp4" />
                </video>
                <button
                  onClick={() => handleUseVideo(video)}
                  className="bg-opacity-70 hover:bg-opacity-90 absolute top-2 left-2 rounded bg-black px-3 py-1 text-sm text-white shadow transition"
                >
                  Use
                </button>
              </div>
            ))}
          </div>

          {totalVideoPages > 1 && (
            <div className="mt-4 flex justify-center gap-4">
              <Button
                variant="outline"
                disabled={videoPage === 1}
                onClick={() => setVideoPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="self-center">
                Page {videoPage} of {totalVideoPages}
              </span>
              <Button
                variant="outline"
                disabled={videoPage === totalVideoPages}
                onClick={() => setVideoPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Selected Videos */}
      {selectedVideos.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Selected Videos</h2>
          <div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {selectedVideos.map((video) => (
                <div
                  key={video.id}
                  className="relative overflow-hidden rounded shadow"
                >
                  <video controls className="h-40 w-full rounded object-cover">
                    <source src={video.videos.medium.url} type="video/mp4" />
                  </video>
                  <button
                    onClick={() =>
                      setSelectedVideos((prev) =>
                        prev.filter((v) => v.id !== video.id),
                      )
                    }
                    className="bg-opacity-60 absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black text-lg font-bold text-white transition hover:bg-red-600"
                    aria-label="Remove video"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixabayGallery;
