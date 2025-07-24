import React, { useState } from "react";
import {
  Image,
  ImagePlus,
  GalleryVerticalEnd,
  Camera,
  Film,
  Cloud,
  CloudDrizzle,
  CloudUpload,
  Folder,
  Globe,
} from "lucide-react";
import UnSplash from "@/pages/dashboard/postContent/createPost/sheet/UnSplash";
import Giphy from "@/pages/dashboard/postContent/createPost/sheet/Giphy";
import Pexels from "@/pages/dashboard/postContent/createPost/sheet/Pexels";
import Pixabay from "@/pages/dashboard/postContent/createPost/sheet/Pixabay";
import OpenVerse from "@/pages/dashboard/postContent/createPost/sheet/OpenVerse";
import MediaLab from "./MediaLab";
import AiArt from "@/pages/dashboard/postContent/createPost/sheet/AiArt";
// 👇 You can create a real component for this
const Openverse = () => <div>Openverse content goes here...</div>;

type SidebarMenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

const sidebarMenuItems: SidebarMenuItem[] = [
  {
    key: "media-library",
    label: "Media Library",
    icon: <Image className="h-5 w-5" />,
  },
  {
    key: "ai-art",
    label: "AI Art",
    icon: <CloudDrizzle className="h-5 w-5" />,
  },
  {
    key: "unsplash",
    label: "Unsplash",
    icon: <ImagePlus className="h-5 w-5" />,
  },
  {
    key: "openverse",
    label: "Openverse",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    key: "giphy",
    label: "Giphy",
    icon: <GalleryVerticalEnd className="h-5 w-5" />,
  },
  
  {
    key: "pexels",
    label: "Pexels",
    icon: <Camera className="h-5 w-5" />,
  },
  {
    key: "pixabay",
    label: "Pixabay",
    icon: <Film className="h-5 w-5" />,
  },
  {
    key: "dropbox",
    label: "Dropbox",
    icon: <Cloud className="h-5 w-5" />,
    disabled: true,
  },
  {
    key: "google-drive",
    label: "Google Drive",
    icon: <CloudUpload className="h-5 w-5" />,
    disabled: true,
  },
  {
    key: "box",
    label: "Box",
    icon: <Folder className="h-5 w-5" />,
    disabled: true,
  },
];


const SheetSideBar: React.FC = () => {
  const [sidebarSelectedKey, setSidebarSelectedKey] =
    useState<string>("media-library");

  const renderSidebarContent = (): React.ReactNode => {
    switch (sidebarSelectedKey) {
      case "media-library":
        return <div><MediaLab/></div>;
      case "unsplash":
        return <UnSplash />;
      case "openverse":
        return <OpenVerse />;
      case "giphy":
        return <Giphy />;
        case "ai-art":
        return <div><AiArt/></div>;

      case "pexels":
        return <Pexels />;
      case "pixabay":
        return <Pixabay />;

      case "dropbox":
      case "google-drive":
      case "box":
        return (
          <div className="text-gray-400">
            {sidebarMenuItems.find((i) => i.key === sidebarSelectedKey)?.label}{" "}
            is currently disabled.
          </div>
        );
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div
      className="flex w-full gap-0 overflow-scroll overflow-x-hidden md:w-[85%] [&>button.absolute.right-4.top-4]:hidden"
      style={{ height: "100vh" }}
    >
      {/* Sidebar */}
      <nav className="flex w-44 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#0f172a]">
        {sidebarMenuItems.map(({ key, label, icon, disabled }) => (
          <button
            key={key}
            className={`flex items-center gap-3 border-l-4 px-4 py-3 text-left text-sm font-medium ${
              disabled
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1e293b]"
            } ${
              sidebarSelectedKey === key && !disabled
                ? "border-blue-600 bg-blue-50 font-semibold text-blue-700 dark:bg-[#1e293b] dark:text-blue-400"
                : "border-transparent"
            } `}
            disabled={disabled}
            onClick={() => !disabled && setSidebarSelectedKey(key)}
            type="button"
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <section className="flex-1 overflow-auto p-6 text-gray-800 dark:text-gray-100">
        {renderSidebarContent()}
      </section>
    </div>
  );
};

export default SheetSideBar;
