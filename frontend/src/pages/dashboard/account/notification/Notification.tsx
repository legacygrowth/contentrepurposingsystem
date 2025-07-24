import React, { useState } from "react";
import { AlertTriangle, UploadCloud } from "lucide-react";

const NotificationCard = () => {
  const [selectedTimeZone, setSelectedTimeZone] = useState("UTC");
  const [selectedWeekDay, setSelectedWeekDay] = useState("Monday");
  const [isHumanPublishing, setIsHumanPublishing] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);

  const handleToggle = () => {
    setIsHumanPublishing(!isHumanPublishing);
    setShowUnsaved(true);
  };

  return (
    <div className="w-full  mx-auto px-4 sm:px-6 py-6 space-y-6 bg-white dark:bg-background rounded-2xl shadow dark:text-white">
      {/* Calendar Section */}
      <div className="space-y-4 rounded-lg border  bg-white p-8 shadow-lg dark:bg-background dark:text-white">
        <div>
          <h2 className="text-xl sm:text-3xl font-semibold text-gray-800 dark:text-white">
            Calendar
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-400">
          Manage calendar settings of the workspace.
          </p>
        </div>
        <hr />
        <div>
          <h1 className="text-sm font-bold">Timezone</h1>
          <p className="text-sm text-gray-400">Current time in time zone: 23 April 2025, 7:52 PM</p>
          <select
            value={selectedTimeZone}
            onChange={(e) => setSelectedTimeZone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:text-white"
          >
            <option value={selectedTimeZone}>Selected</option>
          </select>
        </div>
        <hr />
        <div>
          <h1 className="text-sm font-bold">Week start</h1>
          <p className="text-sm text-gray-400">Pick the first day of the week for your calendar and date pickers.</p>
          <select
            value={selectedWeekDay}
            onChange={(e) => setSelectedWeekDay(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:text-white"
          >
            <option value={selectedWeekDay}>Selected</option>
          </select>
        </div>
      </div>

      {/* Publishing Section */}
      <div className="space-y-4 border-t rounded-lg border bg-white p-8 shadow-lg dark:bg-background dark:text-white  sm:p-6 ">
        <div className="flex items-center space-x-2">
          <UploadCloud className="text-blue-500" size={20} />
          <h2 className="text-xl font-semibold">Publishing</h2>
        </div>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300">
          Control how your content gets published and displayed. You can modify your publishing settings anytime.
        </p>

        <hr />

        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold">Publish like a human</h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300">
              Enable human-like timing and formatting when publishing to social media or external platforms.
            </p>

            {/* Toggle below paragraph */}
            <button
              onClick={handleToggle}
              className={`mt-2 flex h-7 w-14 items-center rounded-full p-1 transition-colors duration-300 ${
                isHumanPublishing ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isHumanPublishing ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Unsaved Changes Alert – shown only when ON */}
          {isHumanPublishing && showUnsaved && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-amber-700 bg-yellow-50 px-4 py-3 dark:bg-white dark:text-black">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-700 dark:text-orange-700" size={18} />
                <span>I have 1 unsaved change</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowUnsaved(false);
                    setIsHumanPublishing(false);
                  }}
                  className="rounded-md border border-yellow-800 px-3 py-1 text-yellow-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowUnsaved(false)}
                  className="rounded-md bg-yellow-800 px-3 py-1 text-white hover:bg-yellow-900"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
