"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  color: string;
};

export default function PopOver({ color }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className={`h-5 w-5 rounded-full border ${color}`}>
            {/* {name} */}
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="left"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="bg-brand w-32"
        >
          <div className="px-0.5 py-0.5">
            <div className="flex gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="h-5 w-5 cursor-help rounded-full border bg-[var(--base-color)]" />
                </TooltipTrigger>
                <TooltipContent>base</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="bg-contrast h-5 w-5 cursor-help rounded-full border" />
                </TooltipTrigger>
                <TooltipContent>contrast</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="bg-brand h-5 w-5 cursor-help rounded-full border" />
                </TooltipTrigger>
                <TooltipContent>brand</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
