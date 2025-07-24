import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
  SortDesc,
  Image,
  RefreshCw,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // adjust path as needed
import { setUser } from "@/store/AppStore";

const Calendar = () => {

 const userDetails = useSelector((state: RootState) => state.user);

  useEffect(() => {    
    if(!userDetails.token){      
      navigate("/auth/login");
    }
  });

  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [sortByLatest, setSortByLatest] = useState(true);
  const [showPreviews, setShowPreviews] = useState(true);
  const [showOutOfRange, setShowOutOfRange] = useState(false);
  const [isMonthYearPickerOpen, setIsMonthYearPickerOpen] = useState(false);

  const posts = [
    {
      id: 1,
      date: new Date(2025, 3, 18),
      time: "4:11 PM",
      title: "Smoking Kills",
      image: "/dashboard/createPosts/smoking.png",
    },
  ];

  const handleMonthSelect = (month: number) => {
    const updated = new Date(currentMonth);
    updated.setMonth(month);
    setCurrentMonth(updated);
    setIsMonthYearPickerOpen(false);
  };

  const renderHeader = () => (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsMonthYearPickerOpen(!isMonthYearPickerOpen)}
            className="flex items-center gap-1 px-3 py-1 text-sm text-black dark:text-white font-medium"
          >
            {format(currentMonth, "MMMM, yyyy")}
            <ChevronDown className="h-4 w-4 text-black dark:text-white" />
          </Button>

          {isMonthYearPickerOpen && (
            <div className="absolute z-10 mt-2 w-64 rounded-lg border bg-white p-4 shadow">
              <div className="mb-2 text-center font-semibold text-gray-700">
                {format(currentMonth, "yyyy")}
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month, index) => (
                  <button
                    key={index}
                    onClick={() => handleMonthSelect(index)}
                    className={`rounded px-2 py-1 hover:bg-gray-200 hover:text-black ${
                      index === currentMonth.getMonth()
                        ? "bg-black text-white"
                        : ""
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-black dark:text-white"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-black dark:text-white"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight />
        </Button>
        <Button onClick={() => setCurrentMonth(new Date())} className="text-sm">
          Today
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/calendar"
          className="text-muted-foreground text-sm hover:underline"
        >
          Posts: {posts.length}
        </Link>
        <Link
          to="/timezone"
          className="text-muted-foreground text-sm hover:underline"
        >
          UTC - UTC
        </Link>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4 text-black dark:text-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <SortDesc className="h-4 w-4" /> Sort by latest
                </span>
                <Switch
                  checked={sortByLatest}
                  onCheckedChange={setSortByLatest}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <Image className="h-4 w-4" /> Show previews
                </span>
                <Switch
                  checked={showPreviews}
                  onCheckedChange={setShowPreviews}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-4 w-4" /> Show out-of-range dates
                </span>
                <Switch
                  checked={showOutOfRange}
                  onCheckedChange={setShowOutOfRange}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button className="bg-black dark:bg-white dark:text-black">New</Button>
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="mt-4 space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="justify-left flex w-full items-center rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          {/* Left side text */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {format(post.date, "MMMM d, yyyy")} — {post.time}
            </p>
          </div>

          {/* Right side image */}
          <img
            src={post.image}
            alt={post.title}
            className="ml-4 h-20 w-20 rounded object-cover"
          />
        </div>
      ))}
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = addDays(startDate, 34);

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const rows = [];
    let days = [];
    let day = startDate;

    // Day names row for XL screens only
    rows.push(
      <div
        key="days-names"
        className="mb-2 hidden grid-cols-7 text-sm font-semibold text-gray-500 xl:grid"
      >
        {daysOfWeek.map((d, idx) => (
          <div key={idx} className="p-2 text-center">
            {d}
          </div>
        ))}
      </div>,
    );

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const post = posts.find((p) => isSameDay(p.date, cloneDay));
        const isSelected = isSameDay(cloneDay, selectedDate);
        const isCurrent = isToday(cloneDay);

        days.push(
          <div
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
            className={`flex min-h-[200px] cursor-pointer flex-col justify-between rounded-lg border bg-white p-4 shadow transition ${
              !isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-400" : ""
            } ${isSelected ? "border-blue-500 bg-blue-50" : ""} ${
              isCurrent ? "ring-2 ring-blue-300" : ""
            }`}
          >
            {/* Day name inside cards (visible on all screens except xl) */}
            <div className="text-xs font-semibold text-gray-500">
              <div className="mb-1 block font-medium text-gray-600 xl:hidden">
                {format(day, "EEE")}
              </div>
              <span>{format(day, "d")}</span>
            </div>

            {post && (
              <div className="mt-2 text-xs">
                <img
                  src={post.image}
                  alt={post.title}
                  className="mb-1 h-20 w-full rounded object-cover"
                />
                <p className="truncate font-medium">{post.title}</p>
                <span className="text-[10px] text-gray-400">{post.time}</span>
              </div>
            )}
          </div>,
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div
          key={day.toString()}
          className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
        >
          {days}
        </div>,
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="min-h-screen w-full p-4">
      <div className="mx-auto max-w-[1600px]">
        {renderHeader()}

        {/* Tabs Component */}
        <Tabs
          value={view}
          onValueChange={(val) => val && setView(val)}
          className="mt-4"
        >
          <div className="flex justify-end">
            {" "}
            {/* Added flex justify-end to move tabs to the right */}
            <TabsList className="bg-muted rounded-md">
              <TabsTrigger value="list" className="px-3 py-1 text-sm">
                List
              </TabsTrigger>
              <TabsTrigger value="month" className="px-3 py-1 text-sm">
                Month
              </TabsTrigger>
            </TabsList>
          </div>

          {/* List Tab Content */}
          <TabsContent value="list">{renderListView()}</TabsContent>

          {/* Month Tab Content */}
          <TabsContent value="month">{renderCells()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Calendar;
