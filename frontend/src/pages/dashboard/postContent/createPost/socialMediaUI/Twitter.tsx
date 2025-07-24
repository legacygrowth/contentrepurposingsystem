import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMedia } from "@/context/MediaContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import {
  Eye,
  Trash2,
  Download,
  X,
  ArrowUp,
  Copy,
  UserMinusIcon,
  Users,
} from "lucide-react";

type SocialPage = {
  image: string;
  name: string;
  page: string;
  value: string;
  id: string;
};

const TwitterPost = ({
  prompt,
  images,
  altText,
}: {
  prompt: string;
  images: File[];
  altText?: string;
}) => {
  const userDetails = useSelector((state: RootState) => state.user);
  const { selectedImages: mediaLibraryImages } = useMedia();

  // Use actual connected Twitter account
  const twitterDetails = {
    image:
      userDetails.twitterProfileImage ||
      "/dashboard/social-accounts/twitter1.png",
    name: `@${userDetails.twitterUsername}`,
    page: "twitter.com/" + userDetails.twitterUsername,
    value: "twitter",
    id: userDetails.twitterUserId || "",
  };

  // Combine uploaded images with media library images
  const allImages = [
    ...(images?.map((file) => ({
      source: "upload" as const,
      id: file.name,
      previewUrl: URL.createObjectURL(file),
      file,
    })) || []),
    ...mediaLibraryImages.map((img) => ({
      source: "media" as const,
      id: img.id,
      previewUrl: img.url,
      alt: img.alt,
    })),
  ];

  return (
    <div className="flex items-start justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md rounded-xl border bg-white shadow-sm">
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex min-w-0 flex-1 gap-3">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                <img
                  src={twitterDetails.image}
                  alt={twitterDetails.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="flex items-center gap-1 text-sm">
                  <span className="truncate font-semibold text-gray-900">
                    {userDetails.twitterUsername}
                  </span>
                  <span className="truncate text-gray-500">
                    {twitterDetails.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Post Text */}
        <CardContent className="px-4 pt-0 pb-3">
          <p className="text-sm leading-relaxed whitespace-pre-line text-gray-800">
            {prompt}
          </p>
        </CardContent>

        {/* Media Preview */}
        {allImages.length > 0 && (
          <div className="px-4 pb-3">
            <div className="grid grid-cols-2 gap-2">
              {allImages.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={img.previewUrl}
                    alt={img.source === "media" ? img.alt : `Preview ${index}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 3 && allImages.length > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 font-bold text-white">
                      +{allImages.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alt Text Info */}
        {altText && allImages.length > 0 && (
          <CardContent className="bg-gray-50 px-4 py-2 text-xs text-gray-500">
            <span className="font-medium">Alt Text:</span> {altText}
          </CardContent>
        )}

        {/* Engagement Metrics */}
        <CardContent className="px-4 pt-2 pb-3">
          <div className="flex items-center justify-between text-gray-500">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1">
                <FaTwitter className="text-gray-500" />
                <span className="text-xs">Twitter</span>
              </button>
              <span className="text-xs">Just now</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterPost;
