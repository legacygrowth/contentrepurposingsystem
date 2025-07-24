import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Eye, Trash, X, Check } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useMedia } from "@/context/MediaContext";

interface Image {
  id: string;
  alt: string;
  src: {
    medium: string;
    small?: string;
    large?: string;
    original?: string;
  };
}

interface VideoFile {
  id?: number;
  quality: "sd" | "hd" | string;
  file_type?: string;
  link: string;
  width?: number;
  height?: number;
}

interface Video {
  id: string;
  duration?: number;
  user?: {
    id?: number;
    name?: string;
    url?: string;
  };
  video_files: VideoFile[];
}

const Pexels = () => {
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

  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Preview dialog states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewStartIndex, setPreviewStartIndex] = useState(0);
  const [previewImages, setPreviewImages] = useState<Image[]>([]);

  // Media context integration
  const { selectedImages, addImage, deleteImage } = useMedia();

  const perPage = 12;

  const IMAGE_API = import.meta.env.VITE_PEXELS_IMAGE_API;
  const VIDEO_API = import.meta.env.VITE_PEXELS_VIDEO_API;
  const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

  const getRandomQuery = () =>
    sampleQueries[Math.floor(Math.random() * sampleQueries.length)];

  const fetchImages = async () => {
    if (!imageQuery) return;
    setLoadingImages(true);
    try {
      const res = await axios.get(
        `${IMAGE_API}?query=${encodeURIComponent(
          imageQuery,
        )}&per_page=${perPage}&page=${imagePage}`,
        {
          headers: { Authorization: API_KEY },
        },
      );
      setImages(res.data.photos);
      setImageTotal(res.data.total_results);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
      setImageTotal(0);
    } finally {
      setLoadingImages(false);
    }
  };

  const fetchVideos = async () => {
    if (!videoQuery) return;
    setLoadingVideos(true);
    try {
      const res = await axios.get(
        `${VIDEO_API}?query=${encodeURIComponent(
          videoQuery,
        )}&per_page=${perPage}&page=${videoPage}`,
        {
          headers: { Authorization: API_KEY },
        },
      );
      setVideos(res.data.videos);
      setVideoTotal(res.data.total_results);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
      setVideoTotal(0);
    } finally {
      setLoadingVideos(false);
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

  // Check if an image is already selected
  const isImageSelected = (imageId: string) => {
    return selectedImages.some((img) => img.id === `pexels-${imageId}`);
  };

  // Handle adding image to media context
  const handleUseImage = (img: Image) => {
    const mediaId = `pexels-${img.id}`;
    if (!isImageSelected(img.id)) {
      addImage(img.src.medium, img.alt || "Pexels image");
    }
  };

  // Handle removing image from media context
  const handleRemoveImage = (imageId: string) => {
    const mediaId = `pexels-${imageId}`;
    const selectedImage = selectedImages.find((img) => img.id === mediaId);
    if (selectedImage) {
      deleteImage(selectedImage.id);
    }
  };

  // Handle image preview
  const handlePreviewClick = (index: number) => {
    setPreviewImages(images);
    setPreviewStartIndex(index);
    setPreviewOpen(true);
  };

  const PaginationControls = ({
    page,
    total,
    onPageChange,
  }: {
    page: number;
    total: number;
    onPageChange: (newPage: number) => void;
  }) => {
    const totalPages = Math.ceil(total / perPage);
    if (totalPages <= 1) return null;

    return (
      <div className="mt-4 flex justify-center gap-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="self-center">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    );
  };

  const ImageCard = ({ img, index }: { img: Image; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isSelected = isImageSelected(img.id);

    return (
      <div
        className="group relative overflow-hidden rounded-lg shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={img.src.medium}
          alt={img.alt}
          className="h-36 w-full object-cover"
        />

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-500 text-white">
              <Check className="mr-1 h-3 w-3" />
              Selected
            </Badge>
          </div>
        )}

        {/* Hover overlay with actions */}
        {(isHovered || isSelected) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handlePreviewClick(index)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Preview</TooltipContent>
              </Tooltip>

              {isSelected ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveImage(img.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove</TooltipContent>
                </Tooltip>
              ) : (
                <Button size="sm" onClick={() => handleUseImage(img)}>
                  Use
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="selected">
            Selected Media ({selectedImages.length})
          </TabsTrigger>
        </TabsList>

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

          {loadingImages ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            </div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {images.map((img, index) => (
                  <ImageCard key={img.id} img={img} index={index} />
                ))}
              </div>
              <PaginationControls
                page={imagePage}
                total={imageTotal}
                onPageChange={setImagePage}
              />
            </>
          )}
        </TabsContent>

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

          {loadingVideos ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            </div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="relative overflow-hidden rounded-lg shadow"
                  >
                    <video controls className="h-36 w-full object-cover">
                      <source
                        src={
                          video.video_files.find(
                            (v) => v.quality === "sd" || v.quality === "hd",
                          )?.link
                        }
                        type="video/mp4"
                      />
                    </video>
                    <Button
                      // onClick={() => handleUseVideo(video)}
                      className="absolute top-2 left-2 z-10"
                      size="sm"
                    >
                      Use
                    </Button>
                  </div>
                ))}
              </div>
              <PaginationControls
                page={videoPage}
                total={videoTotal}
                onPageChange={setVideoPage}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="selected">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Selected Images</h3>
            {selectedImages.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No images selected yet. Go to the Images tab to select some!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {selectedImages.map((img, index) => (
                  <div
                    key={img.id}
                    className="relative overflow-hidden rounded-lg shadow"
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="h-36 w-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2">{index + 1}</Badge>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setPreviewImages(
                                selectedImages.map((si) => ({
                                  id: si.id,
                                  alt: si.alt,
                                  src: { medium: si.url },
                                })),
                              );
                              setPreviewStartIndex(index);
                              setPreviewOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Preview</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteImage(img.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl p-0">
          <DialogHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle>Image Preview</DialogTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPreviewOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {previewImages.length > 0 && (
              <Carousel
                className="h-full w-full"
                opts={{
                  startIndex: previewStartIndex,
                  loop: true,
                }}
              >
                <CarouselContent className="ml-0 h-full">
                  {previewImages.map((img, index) => (
                    <CarouselItem key={index} className="pl-0">
                      <div className="flex h-[60vh] items-center justify-center p-4">
                        <img
                          src={img.src.medium}
                          alt={img.alt}
                          className="max-h-full max-w-full rounded-lg object-contain"
                        />
                      </div>
                      <div className="pb-4 text-center text-sm text-gray-500">
                        {img.alt} ({index + 1} of {previewImages.length})
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {previewImages.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute top-1/2 left-4 z-10 -translate-y-1/2" />
                    <CarouselNext className="absolute top-1/2 right-4 z-10 -translate-y-1/2" />
                  </>
                )}
              </Carousel>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pexels;
