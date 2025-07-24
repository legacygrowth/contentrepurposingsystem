import React, { useState, useEffect } from "react";
import {
  Download,
  MoreVertical,
  Eye,
  Link2,
  Folder,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // adjust path as needed
import { setUser } from "@/store/AppStore";
import { useNavigate } from "react-router-dom";

// Popover menu
const PopoverMenu = () => {

 const dispatch = useDispatch();
  const userDetails = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    if(!userDetails.token){      
      navigate("/auth/login");
    }
});

  //const location = useLocation();
  const navigate = useNavigate();
  //const { token } = location.state || {};

  const items = [
    {
      icon: <Check className="h-4 w-4" />,
      label: "Select",
      onClick: () => alert("Selected"),
    },
    {
      icon: <Eye className="h-4 w-4" />,
      label: "Preview",
      onClick: () => alert("Preview"),
    },
    {
      icon: <Link2 className="h-4 w-4" />,
      label: "Get Link",
      onClick: () => alert("Link copied"),
    },
    {
      icon: <Folder className="h-4 w-4" />,
      label: "Move to folder",
      onClick: () => alert("Moved to folder"),
    },
    {
      icon: <Pencil className="h-4 w-4" />,
      label: "Rename",
      onClick: () => alert("Rename clicked"),
    },
    {
      icon: <Trash2 className="h-4 w-4 text-red-600" />,
      label: "Move to trash",
      danger: true,
      onClick: () => alert("Moved to trash"),
    },
  ];

  return (
    <PopoverContent align="end" className="w-48 p-1 shadow-lg">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={item.onClick}
          className={cn(
            "flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100",
            item.danger && "text-red-600 hover:bg-red-50",
          )}
        >
          <div className="mr-2">{item.icon}</div>
          <span>{item.label}</span>
        </div>
      ))}
    </PopoverContent>
  );
};

// Media card
const MediaCard = ({ imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filename = imageUrl.split("/").pop();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        className="group relative h-[300px] w-full overflow-hidden rounded-xl shadow-sm transition hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <DialogTrigger asChild>
          <img
            src={imageUrl}
            alt="media"
            className="h-full w-full cursor-pointer object-cover"
          />
        </DialogTrigger>

        {isHovered && (
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <button
              onClick={handleDownload}
              className="cursor-pointer rounded bg-white p-1 shadow"
            >
              <Download className="h-5 w-5 text-gray-700" />
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <button className="cursor-pointer rounded bg-white p-1 shadow">
                  <MoreVertical className="h-5 w-5 text-gray-700" />
                </button>
              </PopoverTrigger>
              <PopoverMenu />
            </Popover>
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 z-20 bg-black/50 px-3 py-1 text-sm text-white">
          {filename}
        </div>
      </div>

      <DialogContent className="max-w-4xl overflow-hidden p-0">
        <img
          src={imageUrl}
          alt="Preview"
          className="h-auto max-h-[100vh] w-full object-contain"
        />
      </DialogContent>
    </Dialog>
  );
};


const MediaLibrary = () => {
  const images = [
    "/dashboard/media-library/image1.jpg",
    "/dashboard/media-library/image2.jpg",
    "/dashboard/media-library/image3.jpg",
    "/dashboard/media-library/image4.jpg",
    "/dashboard/media-library/image5.jpg",
  ];

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {images.map((img, idx) => (
          <MediaCard key={idx} imageUrl={img} />
        ))}
      </div>
    </div>
  );
};


export default MediaLibrary;
