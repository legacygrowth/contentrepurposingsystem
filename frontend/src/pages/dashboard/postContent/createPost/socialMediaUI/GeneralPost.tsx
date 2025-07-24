import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MoreHorizontal, User } from "lucide-react";
import { useMedia } from "@/context/MediaContext";
import { useEffect, useState } from "react";

type GeneralPostProps = {
  prompt: string;
  uploadedImages: File[];
};

const GeneralPost = ({ prompt, uploadedImages }: GeneralPostProps) => {
  const { selectedImages: mediaLibraryImages } = useMedia();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Generate URLs for uploaded images
  useEffect(() => {
    const urls = uploadedImages.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedImages]);

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
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <Card className="w-full rounded-xl bg-white shadow-sm">
          {/* Header */}
          <CardHeader className="p-2 sm:p-3 md:p-4">
            <div className="flex items-center gap-2 px-2 sm:px-4">
              {/* Avatar */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 sm:h-10 sm:w-10">
                <User className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
              </div>
              {/* Name & timestamp */}
              <div className="flex w-full flex-col gap-1 sm:gap-2">
                <span className="flex items-center justify-between text-xs font-semibold text-gray-900 sm:text-sm">
                  <span className="h-2 w-1/2 rounded bg-gray-300"></span>
                  <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <span className="h-2 w-1/4 rounded bg-gray-300"></span>
              </div>
            </div>
          </CardHeader>

          {/* Prompt */}
          <CardContent className="px-3 pt-0 sm:px-4 md:px-6">
            <p className="text-xs leading-relaxed whitespace-pre-line text-gray-800 sm:text-sm">
              {prompt &&
                prompt.split(`\n`).map((line, index) => (
                  <span key={index}>
                    {line.trim()}
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
                        {/* Image counter overlay */}
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

          {/* Footer buttons skeleton */}
          <CardContent className="px-3 pt-3 pb-3 sm:px-4 sm:pt-4 sm:pb-4 md:px-6">
            <div className="flex justify-around gap-3 sm:gap-6">
              <span className="h-2 w-1/3 rounded bg-gray-300"></span>
              <span className="h-2 w-1/3 rounded bg-gray-300"></span>
              <span className="h-2 w-1/3 rounded bg-gray-300"></span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralPost;
