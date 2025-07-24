import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMedia } from "@/context/MediaContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  GalleryVertical,
  GripVertical,
  Info,
  MoreVertical,
  Puzzle,
  Upload,
  Eye,
  Trash,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./CreatePost";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Props = {
  form: UseFormReturn<FormValues>;
  onOpenMediaLibrary: () => void;
};

const ImageInputField = ({ form, onOpenMediaLibrary }: Props) => {
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewStartIndex, setPreviewStartIndex] = useState(0);
  const { setValue, watch } = form;
  const rawImages = watch("images");
  const images = useMemo(() => rawImages || [], [rawImages]);
  const {
    selectedImages: mediaLibraryImages,
    deleteImage: deleteMediaImage,
    reorderImages: reorderMediaImages,
  } = useMedia();

  // Generate preview URLs and cleanup properly
  const filesWithPreview = useMemo(() => {
    return images.map((file: File) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: `${file.name}-${file.lastModified}`,
    }));
  }, [images]);

  const allImages = useMemo(() => {
    const uploaded = filesWithPreview.map(({ file, previewUrl, id }) => ({
      source: "upload" as const,
      id,
      previewUrl,
      file,
    }));

    const mediaLib = mediaLibraryImages.map((img) => ({
      source: "media" as const,
      id: img.id,
      previewUrl: img.url,
      alt: img.alt,
    }));

    return [...uploaded, ...mediaLib];
  }, [filesWithPreview, mediaLibraryImages]);

  const handleDeleteImage = useCallback(
    (source: "upload" | "media", targetId: string) => {
      if (source === "upload") {
        const filteredImages = images.filter((file: File) => {
          const fileId = `${file.name}-${file.lastModified}`;
          return fileId !== targetId;
        });
        setValue("images", filteredImages, { shouldValidate: true });
      } else {
        deleteMediaImage(targetId);
      }
    },
    [images, setValue, deleteMediaImage],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      filesWithPreview.forEach(({ previewUrl }) =>
        URL.revokeObjectURL(previewUrl),
      );
    };
  }, [filesWithPreview]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      if (e.target.files?.length) {
        const newFiles = Array.from(e.target.files);
        setValue("images", [...images, ...newFiles], { shouldValidate: true });
      }
    },
    [images, setValue],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      // Find items in the combined array
      const activeItem = allImages.find((img) => img.id === active.id);
      const overItem = allImages.find((img) => img.id === over.id);

      if (!activeItem || !overItem) return;

      // Handle reordering for uploaded files only
      if (activeItem.source === "upload" && overItem.source === "upload") {
        const oldIndex = images.findIndex((file: File) => {
          const fileId = `${file.name}-${file.lastModified}`;
          return fileId === active.id;
        });
        const newIndex = images.findIndex((file: File) => {
          const fileId = `${file.name}-${file.lastModified}`;
          return fileId === over.id;
        });

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedImages = arrayMove(images, oldIndex, newIndex);
          setValue("images", reorderedImages, { shouldValidate: true });
        }
      }
      // Handle reordering for media library images only
      else if (activeItem.source === "media" && overItem.source === "media") {
        const oldIndex = mediaLibraryImages.findIndex(
          (img) => img.id === active.id,
        );
        const newIndex = mediaLibraryImages.findIndex(
          (img) => img.id === over.id,
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          // Use the reorderMediaImages function from context
          reorderMediaImages(oldIndex, newIndex);
        }
      }
      // Handle cross-type reordering (between uploaded and media library)
      // This part depends on your specific requirements
      // You might want to prevent cross-type reordering or handle it differently
    },
    [images, setValue, mediaLibraryImages, allImages, reorderMediaImages],
  );

  const handlePreviewClick = useCallback((index: number) => {
    setPreviewStartIndex(index);
    setPreviewOpen(true);
  }, []);

  return (
    <>
      <div className="relative flex flex-col gap-2 text-[var(--contrast-color)]">
        <div className="text-sm font-medium sm:text-base">Media</div>

        {allImages.length === 0 ? (
          <>
            <div className="xs:h-28 relative h-24 w-full border-2 border-dashed sm:h-32 md:h-36 lg:h-40">
              <input
                className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
              />
              <div className="xs:gap-2 absolute inset-0 flex flex-col items-center justify-center gap-1 px-2">
                <Popover open={isInfoHovered} onOpenChange={setIsInfoHovered}>
                  <PopoverTrigger
                    className="absolute top-1 right-1"
                    onMouseEnter={() => setIsInfoHovered(true)}
                    onMouseLeave={() => setIsInfoHovered(false)}
                  >
                    <Info className="xs:h-4 xs:w-4 relative z-[999999999] h-3 w-3" />
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    className="xs:w-60 xs:text-sm w-48 space-y-2 text-xs"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Accepted file formats:</p>
                      <ul className="list-disc pl-4">
                        <li>png</li>
                        <li>jpeg</li>
                        <li>webp</li>
                        <li>gif</li>
                        <li>mp4</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Maximum file size:</p>
                      <p>100MB</p>
                    </div>
                  </PopoverContent>
                </Popover>
                <Upload className="xs:h-5 xs:w-5 h-4 w-4 sm:h-6 sm:w-6" />
                <div className="xs:text-sm text-center text-xs sm:text-base">
                  Click to upload or drag and drop
                </div>
                <div className="xs:flex-row xs:gap-2 relative z-[9999] flex flex-col gap-1">
                  <Button
                    type="button"
                    onClick={onOpenMediaLibrary}
                    size="sm"
                    className="xs:h-8 xs:px-3 xs:text-sm h-7 px-2 text-xs"
                  >
                    <GalleryVertical className="xs:mr-2 xs:h-4 xs:w-4 mr-1 h-3 w-3" />
                    <span className="xs:inline hidden">Media Library</span>
                    <span className="xs:hidden">Media</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={onOpenMediaLibrary}
                    size="sm"
                    className="xs:h-8 xs:px-3 xs:text-sm h-7 px-2 text-xs"
                  >
                    <Puzzle className="xs:mr-2 xs:h-4 xs:w-4 mr-1 h-3 w-3" />
                    Plugins
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={({ active }) => setActiveId(active.id as string)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={allImages.map((img) => img.id)}>
              <div className="xs:gap-2 grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                <div className="xs:p-3 relative flex aspect-square items-center justify-center border-2 border-dashed p-2 sm:p-4">
                  <input
                    className="absolute inset-0 z-50 h-full cursor-pointer opacity-0"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <Popover open={isInfoHovered} onOpenChange={setIsInfoHovered}>
                    <PopoverTrigger
                      className="absolute top-1 right-1"
                      onMouseEnter={() => setIsInfoHovered(true)}
                      onMouseLeave={() => setIsInfoHovered(false)}
                    >
                      <Info className="xs:h-4 xs:w-4 relative z-[999999999] h-3 w-3" />
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      className="xs:w-60 xs:text-sm w-48 space-y-2 text-xs"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">Accepted file formats:</p>
                        <ul className="list-disc pl-4">
                          <li>png</li>
                          <li>jpeg</li>
                          <li>webp</li>
                          <li>gif</li>
                          <li>mp4</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium">Maximum file size:</p>
                        <p>100MB</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Upload className="xs:h-5 xs:w-5 h-4 w-4 sm:h-6 sm:w-6" />
                  <Popover>
                    <PopoverTrigger className="bg-background xs:p-1 absolute right-1 bottom-1 rounded-full p-0.5 hover:bg-gray-100">
                      <MoreVertical className="xs:h-4 xs:w-4 relative z-[999999999999] h-3 w-3 sm:h-5 sm:w-5" />
                    </PopoverTrigger>
                    <PopoverContent className="xs:w-40 w-32 p-1" align="end">
                      <Button
                        variant="ghost"
                        className="xs:text-sm w-full justify-start text-xs"
                        onClick={onOpenMediaLibrary}
                      >
                        <GalleryVertical className="xs:mr-2 xs:h-4 xs:w-4 mr-1 h-3 w-3" />
                        <span className="xs:inline hidden">Media Library</span>
                        <span className="xs:hidden">Media</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="xs:text-sm w-full justify-start text-xs"
                        onClick={onOpenMediaLibrary}
                      >
                        <Puzzle className="xs:mr-2 xs:h-4 xs:w-4 mr-1 h-3 w-3" />{" "}
                        Plugins
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>

                {allImages.map((img, index) => (
                  <SortableItem
                    key={img.id}
                    id={img.id}
                    source={img.source}
                    previewUrl={img.previewUrl}
                    index={index + 1}
                    alt={img.source === "media" ? img.alt : `Preview ${index}`}
                    onDelete={handleDeleteImage}
                    onPreview={() => handlePreviewClick(index)}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <img
                  src={
                    allImages.find((img) => img.id === activeId)?.previewUrl ||
                    ""
                  }
                  className="xs:w-20 aspect-square w-16 rounded-md object-cover opacity-80 shadow-lg sm:w-24 md:w-28 lg:w-32"
                  alt="Dragging preview"
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="xs:max-w-sm max-h-[90vh] w-[95vw] max-w-xs p-0 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl">
          <DialogHeader className="xs:p-3 xs:pb-2 p-2 pb-1 sm:p-4 sm:pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="xs:text-base text-sm sm:text-lg">
                Image Preview
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {allImages.length > 0 && (
              <Carousel
                className="h-full w-full"
                opts={{
                  startIndex: previewStartIndex,
                  loop: true,
                }}
              >
                <CarouselContent className="ml-0 h-full">
                  {allImages.map((img, index) => (
                    <CarouselItem key={index} className="pl-0">
                      <div className="xs:h-[50vh] xs:p-3 flex h-[40vh] items-center justify-center p-2 sm:h-[60vh] sm:p-4">
                        <img
                          src={img.previewUrl}
                          alt={
                            img.source === "media"
                              ? img.alt
                              : `Preview ${index + 1}`
                          }
                          className="max-h-full max-w-full rounded-lg object-contain"
                        />
                      </div>
                      <div className="xs:pb-3 xs:text-sm pb-2 text-center text-xs text-gray-500 sm:pb-4">
                        <div className="truncate px-2">
                          {img.source === "media" ? img.alt : img.file?.name}
                        </div>
                        <div className="text-xs opacity-75">
                          ({index + 1} of {allImages.length})
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {allImages.length > 1 && (
                  <>
                    <CarouselPrevious className="xs:left-2 xs:h-8 xs:w-8 absolute top-1/2 left-1 z-10 h-6 w-6 -translate-y-1/2 sm:left-4 sm:h-10 sm:w-10" />
                    <CarouselNext className="xs:right-2 xs:h-8 xs:w-8 absolute top-1/2 right-1 z-10 h-6 w-6 -translate-y-1/2 sm:right-4 sm:h-10 sm:w-10" />
                  </>
                )}
              </Carousel>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageInputField;

const SortableItem = ({
  id,
  source,
  previewUrl,
  index,
  alt,
  onDelete,
  onPreview,
}: {
  id: string;
  source: "upload" | "media";
  previewUrl: string;
  index: number;
  alt: string;
  onDelete: (source: "upload" | "media", id: string) => void;
  onPreview: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
  };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        onMouseEnter={() => setIsHovered(true)}
        onClick={() => setIsHovered(!isHovered)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative aspect-square touch-none rounded-md"
      >
        <img
          src={previewUrl}
          alt={alt}
          className={`h-full w-full rounded-md object-cover ${
            source === "media"
              ? ""
              : isDragging
                ? "border-primary opacity-50"
                : "border-2 border-transparent"
          }`}
        />

        <Badge className="xs:h-5 xs:px-2 xs:text-sm absolute top-0 left-0 h-4 px-1 text-xs opacity-50">
          {index}
        </Badge>

        {isHovered && (
          <div className="xs:gap-1 xs:px-2 xs:py-2 absolute bottom-0 z-50 flex w-full items-center justify-evenly gap-0.5 rounded-md bg-black/50 px-1 py-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Eye
                  className="xs:h-4 xs:w-4 h-3 w-3 cursor-pointer text-white hover:text-blue-400 sm:h-5 sm:w-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview();
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top">Preview</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Trash
                  className="xs:h-4 xs:w-4 h-3 w-3 cursor-pointer text-white hover:text-red-500 sm:h-5 sm:w-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(source, id);
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top">Remove</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <GripVertical
                  className="xs:h-4 xs:w-4 h-3 w-3 cursor-grab text-white active:cursor-grabbing sm:h-5 sm:w-5"
                  {...listeners}
                />
              </TooltipTrigger>
              <TooltipContent side="top">Drag&Drop</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
};
