import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ThumbsUp, MessageSquare, Send, User } from "lucide-react";
import { useMedia } from "@/context/MediaContext";
import { useEffect, useState } from "react";

type SocialPage = {
  image: string;
  name: string;
  page: string;
  value: string;
};

type LinkedInPostProps = {
  social?: SocialPage;
  prompt: string;
  images: File[];
};

const LinkedInPost = ({ prompt, images, social }: LinkedInPostProps) => {
  const { selectedImages: mediaLibraryImages } = useMedia();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Generate URLs for uploaded images
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Combine both types of images
  const allImages = [
    ...imageUrls.map((url) => ({ type: "uploaded", url })),
    ...mediaLibraryImages.map((img) => ({
      type: "media",
      url: img.url,
      alt: img.alt,
    })),
  ];

  return (
    <div className="flex w-full items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8">
      <Card className="w-full max-w-xs rounded-xl border bg-white shadow-sm sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Header */}
        <CardHeader className="px-3 pb-2 sm:px-4 md:px-6">
          <div className="flex gap-2 sm:gap-3">
            {/* Profile Picture */}
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 sm:h-12 sm:w-12">
              {social?.image ? (
                <img
                  src={social.image}
                  alt={social.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-5 w-5 text-gray-500 sm:h-6 sm:w-6" />
                </div>
              )}
            </div>

            {/* Name, job title & time */}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <span className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                {social?.page || "Name"}
              </span>
              <span className="truncate text-xs text-gray-500">
                {social?.value || "Job Title · 1h ago"}
              </span>
            </div>
          </div>
        </CardHeader>

        {/* Post Content */}
        <CardContent className="px-3 pt-1 pb-2 sm:px-4 md:px-6">
          <p className="text-xs leading-relaxed whitespace-pre-line text-gray-800 sm:text-sm">
            {prompt.split(`\n`).map((word, index) => (
              <span key={index}>
                {word.trim()}
                <br />
              </span>
            ))}
          </p>
        </CardContent>

        {/* Image Carousel - Fixed Container */}
        {allImages.length > 0 && (
          <div className="relative w-full">
            <Carousel className="w-full">
              <CarouselContent className="ml-0">
                {allImages.map((img, index) => (
                  <CarouselItem key={index} className="pl-0">
                    {/* Fixed aspect ratio container */}
                    <div
                      className="relative w-full bg-gray-100"
                      style={{ aspectRatio: "16/10" }}
                    >
                      <img
                        src={img.url}
                        alt={
                          img.type === "media" ? img.alt : `Uploaded ${index}`
                        }
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/800x500/e5e7eb/6b7280?text=Image+Not+Found";
                        }}
                      />
                      {/* Optional: Image counter overlay */}
                      {allImages.length > 1 && (
                        <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                          {index + 1}/{allImages.length}
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {allImages.length > 1 && (
                <>
                  <CarouselPrevious className="absolute top-1/2 left-2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border-0 bg-white/90 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white" />
                  <CarouselNext className="absolute top-1/2 right-2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border-0 bg-white/90 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white" />
                </>
              )}
            </Carousel>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-around border-t px-2 pt-2 pb-3 sm:px-4 sm:pt-3 sm:pb-4">
          <button className="flex items-center gap-1 rounded px-1 py-1 text-gray-500 transition-colors duration-200 hover:text-blue-600 sm:gap-2 sm:px-2">
            <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs font-medium sm:text-sm">Like</span>
          </button>
          <button className="flex items-center gap-1 rounded px-1 py-1 text-gray-500 transition-colors duration-200 hover:text-blue-600 sm:gap-2 sm:px-2">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs font-medium sm:text-sm">Comment</span>
          </button>
          <button className="flex items-center gap-1 rounded px-1 py-1 text-gray-500 transition-colors duration-200 hover:text-blue-600 sm:gap-2 sm:px-2">
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs font-medium sm:text-sm">Share</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LinkedInPost;
