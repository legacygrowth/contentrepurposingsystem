import { UseFormReturn, Controller } from "react-hook-form";
import { FormValues } from "./CreatePost";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChartAreaInteractive } from "@/components/dashboard/chartArea/ChartArea";

interface PostGroupProps {
  form: UseFormReturn<FormValues>;
}

export default function PostGroup({ form }: PostGroupProps) {
  const { control, watch } = form;
  const postStatus = watch("postStatus");

  return (
    <div className="space-y-2">
      <Controller
        name="postStatus"
        control={control}
        render={({ field }) => (
          <ToggleGroup
            type="single"
            value={field.value}
            onValueChange={(val) => val && field.onChange(val)}
            className="inline-flex overflow-hidden border border-gray-300"
          >
            <ToggleGroupItem
              value="draft"
              aria-label="Toggle Draft"
              className="border-r border-gray-300 bg-white px-4 py-2 text-gray-700 last:border-r-0 hover:bg-gray-100 data-[state=on]:bg-gray-900 data-[state=on]:text-white"
            >
              Draft
            </ToggleGroupItem>
            <ToggleGroupItem
              value="now"
              aria-label="Toggle Post Now"
              className="border-r border-gray-300 bg-white px-4 py-2 text-gray-700 last:border-r-0 hover:bg-gray-100 data-[state=on]:bg-gray-900 data-[state=on]:text-white"
            >
              Post now
            </ToggleGroupItem>
            <ToggleGroupItem
              value="scheduleForLater"
              aria-label="Toggle Schedule for later"
              className="bg-white px-8 py-2 text-gray-700 hover:bg-gray-100 data-[state=on]:bg-gray-900 data-[state=on]:text-white"
            >
              Schedule for later
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      />
      {/* Schedule Inputs */}
      {postStatus === "scheduleForLater" && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            {/* Date Picker */}
            <Controller
              name="scheduledDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className={cn(
                        "w-1/2 cursor-pointer justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />

            {/* Time Picker */}
            <Controller
              name="scheduledTime"
              control={control}
              render={({ field }) => (
                <Input
                  type="time"
                  value={field.value}
                  onChange={(e) => {
                    const time = e.target.value;
                    field.onChange(time);
                  }}
                  className="w-full !text-black"
                />
              )}
            />
          </div>
          <div className="flex">
         
          </div>
        </div>
      )}
    </div>
  );
}
