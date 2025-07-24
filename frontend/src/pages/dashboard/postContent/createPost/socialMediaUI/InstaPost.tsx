import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { useMedia } from "@/context/MediaContext";
import { useEffect, useState } from "react";

type SocialPage = {
  image: string;
  name: string;
  page: string;
  value: string;
};

type InstaProps = {
  social?: SocialPage;
  prompt: string;
  images: File[];
};

const Insta = ({ prompt, images, social }: InstaProps) => {
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Profile Pic */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 sm:h-10 sm:w-10">
              {social?.image && (
                <img
                  src={social.image}
                  alt={social.name}
                  className="h-8 w-8 object-cover sm:h-10 sm:w-10"
                />
              )}
            </div>
            {/* Username & menu */}
            <div className="flex w-full min-w-0 items-center justify-between">
              <span className="truncate pr-2 text-xs font-semibold text-gray-900 sm:text-sm">
                {social?.page}
              </span>
              <MoreHorizontal className="h-4 w-4 flex-shrink-0 cursor-pointer hover:text-gray-600 sm:h-5 sm:w-5" />
            </div>
          </div>
        </CardHeader>

        {/* Image Carousel - Fixed Container */}
        {allImages.length > 0 && (
          <div className="relative w-full">
            <Carousel className="w-full">
              <CarouselContent className="ml-0">
                {allImages.map((img, index) => (
                  <CarouselItem key={index} className="pl-0">
                    {/* Fixed aspect ratio container - Instagram square format */}
                    <div
                      className="relative w-full bg-gray-100"
                      style={{ aspectRatio: "1/1" }}
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
                            "https://via.placeholder.com/500x500/e5e7eb/6b7280?text=Image+Not+Found";
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

        {/* Footer buttons */}
        <CardContent className="flex justify-between px-3 pt-2 sm:px-4 sm:pt-3 md:px-6">
          <div className="flex gap-2 sm:gap-4">
            <Heart className="h-5 w-5 cursor-pointer text-gray-700 transition-colors duration-200 hover:text-red-500 sm:h-6 sm:w-6" />
            <MessageCircle className="h-5 w-5 cursor-pointer text-gray-700 transition-colors duration-200 hover:text-blue-500 sm:h-6 sm:w-6" />
            <Send className="h-5 w-5 cursor-pointer text-gray-700 transition-colors duration-200 hover:text-blue-500 sm:h-6 sm:w-6" />
          </div>
        </CardContent>

        {/* Caption */}
        <CardContent className="px-3 pt-1 pb-3 sm:px-4 md:px-6">
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
      </Card>
    </div>
  );
};

export default Insta;
