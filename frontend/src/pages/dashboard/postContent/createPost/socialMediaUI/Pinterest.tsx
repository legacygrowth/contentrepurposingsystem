import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { useMedia } from "@/context/MediaContext";
import { useEffect, useState } from "react";

type SocialPage = {
  image: string;
  name: string;
  page: string;
  value: string;
};

type PinterestProps = {
  social?: SocialPage;
  prompt: string;
  images: File[];
};

const Pinterest = ({ prompt, images, social }: PinterestProps) => {
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
    <div className="flex items-start justify-center bg-gray-50 px-2 sm:px-4 md:px-6 lg:px-8">
      <Card className="xs:max-w-[320px] w-full max-w-[280px] overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md sm:max-w-[360px] md:max-w-[400px] lg:max-w-[420px] xl:max-w-[450px]">
        {/* Header */}
        <CardHeader className="flex flex-row items-start justify-between p-3 pb-2 sm:p-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            {/* Profile Image */}
            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 sm:h-10 sm:w-10">
              <img
                src={social?.image || ""}
                alt={social?.name || "Profile"}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                {social?.page || "Board Name"}
              </span>
              <span className="truncate text-xs text-gray-500">
                Pinned by {social?.name || "User"}
              </span>
            </div>
          </div>
          <MoreHorizontal className="h-4 w-4 flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 sm:h-5 sm:w-5" />
        </CardHeader>

        {/* Image Carousel - Fixed Container */}
        {allImages.length > 0 && (
          <div className="relative w-full">
            <Carousel className="w-full">
              <CarouselContent className="ml-0">
                {allImages.map((img, index) => (
                  <CarouselItem key={index} className="pl-0">
                    {/* Fixed aspect ratio container - Pinterest style (3:4 ratio) */}
                    <div
                      className="relative w-full bg-gray-100"
                      style={{ aspectRatio: "3/4" }}
                    >
                      <img
                        src={img.url}
                        alt={
                          img.type === "media" ? img.alt : `Pin ${index + 1}`
                        }
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/600x800/e5e7eb/6b7280?text=Image+Not+Found";
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

        {/* Footer */}
        <CardContent className="flex items-start justify-between gap-2 p-3 pt-3 sm:gap-3 sm:p-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs leading-relaxed font-medium whitespace-pre-line text-gray-800 sm:text-sm">
              {prompt &&
                prompt.split("\n").map((line, index) => (
                  <span key={index} className="block">
                    {line.trim()}
                  </span>
                ))}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-1 sm:gap-2">
            <Bookmark className="h-4 w-4 cursor-pointer text-gray-500 transition-colors duration-200 hover:text-red-500 sm:h-5 sm:w-5" />
            <Share2 className="h-4 w-4 cursor-pointer text-gray-500 transition-colors duration-200 hover:text-blue-500 sm:h-5 sm:w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pinterest;
