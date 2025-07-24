import { Eye } from "lucide-react";
import { useState } from "react";
import ImgsViewer from "react-images-viewer"; 
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ImagePreviewer({ images }: { images: string[] }) {
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);

  const openViewer = (index: number) => {
    setCurrImg(index);
    setViewerIsOpen(true);
  };

  const closeViewer = () => setViewerIsOpen(false);
  const gotoNext = () =>
    setCurrImg((prev) => Math.min(prev + 1, images.length - 1));
  const gotoPrevious = () => setCurrImg((prev) => Math.max(prev - 1, 0));

  const formattedImgs = images.map((src) => ({ src }));

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Eye
            className="h-5 w-5 cursor-pointer text-white"
            onClick={() => openViewer(0)} // default opens first image
          />
        </TooltipTrigger>
        <TooltipContent side="top">Preview</TooltipContent>
      </Tooltip>

      <ImgsViewer
        imgs={formattedImgs}
        currImg={currImg}
        isOpen={viewerIsOpen}
        onClickPrev={gotoPrevious}
        onClickNext={gotoNext}
        onClose={closeViewer}
      />
    </>
  );
}
