import React, { useState } from "react";
import { Sun, Moon, Check, X } from "lucide-react";
import { useTheme } from "../themeprovider/Themeprovider"; // adjust path as needed

const AppearenceCard: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { theme, changeTheme } = useTheme();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = (mode: "light" | "dark") => {
    setThemeMode(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  };

  const handleDeleteWorkspace = () => {
    setIsModalOpen(false);
    // Your deletion logic
  };

  return (
    <div className="mx-auto mt-10 w-full space-y-6">
      {/* Card 1: Image Upload */}
      <div className="dark:bg-background space-y-6 rounded-2xl bg-white p-6 shadow-lg dark:text-white">
        <div>
          <h2 className="text-xl font-medium">Image</h2>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            Choose an image to upload. You’ll see a preview on the left.
          </p>
          <div className="mt-4 w-full border-b border-gray-300 dark:border-gray-700"></div>
        </div>

        <div className="flex items-center gap-6">
          <div className="dark:bg-background flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border bg-gray-100">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover" 
              />
            ) : (
              <span className="text-sm text-gray-400">No image</span>
            )}
          </div>

          <div>
            <label
              className={`cursor-pointer rounded-lg px-4 py-2 text-white transition ${
                theme.isTailwind ? theme.buttonColor : ""
              }`}
              style={
                !theme.isTailwind ? { backgroundColor: theme.buttonColor } : {}
              }
            >
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Card 2: Theme Toggle */}
      <div className="dark:bg-background space-y-6 rounded-lg bg-white p-8 shadow-lg dark:text-white">
        <div>
          <h2 className="text-xl font-medium">Theme mode</h2>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            Select theme for the dashboard.
          </p>
          <div className="mt-4 w-full border-b border-gray-300 dark:border-gray-700"></div>
        </div>

        <div className="flex gap-4">
          {/* Light Theme */}
          <div
            className={`relative h-35 w-90 cursor-pointer overflow-hidden rounded-lg border-2 ${
              themeMode === "light" ? "border-gray-600" : "border-transparent"
            }`}
            onClick={() => toggleTheme("light")}
          >
            <img
              src="/dashboard/theme/light.webp"
              alt="Light Theme"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 flex w-full items-center justify-center gap-2 bg-white/60 py-2 text-xs text-black dark:bg-black/60 dark:text-white">
              <Sun size={14} />
              White Theme
            </div>
          </div>

          {/* Dark Theme */}
          <div
            className={`relative h-35 w-90 cursor-pointer overflow-hidden rounded-lg border-2 ${
              themeMode === "dark" ? "border-gray-600" : "border-transparent"
            }`}
            onClick={() => toggleTheme("dark")}
          >
            <img
              src="/dashboard/theme/dark.webp"
              alt="Dark Theme"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 flex w-full items-center justify-center gap-2 bg-white/60 py-2 text-xs text-black dark:bg-black/60 dark:text-white">
              <Moon size={14} />
              Black Theme
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Basic Information */}
      <div className="dark:bg-background space-y-6 rounded-2xl bg-white p-6 shadow-lg dark:text-white">
        <div>
          <h2 className="text-xl font-medium">Basic Information</h2>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            Enter the name of your workspace. This will be used across the
            dashboard.
          </p>
          <div className="mt-4 w-full border-b border-gray-300 dark:border-gray-700"></div>
        </div>

        <div>
          <label htmlFor="workspace-name" className="text-sm font-medium">
            Workspace Name
          </label>
          <input
            type="text"
            id="workspace-name"
            placeholder="Enter your workspace name"
            className="dark:bg-background mt-2 w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Card 4: Theme Color */}
      <div className="dark:bg-background space-y-6 rounded-2xl bg-white p-6 shadow-lg dark:text-white">
        <div>
          <h2 className="text-xl font-medium">Theme Color</h2>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            Choose a color theme. This will update the Upload button color.
          </p>
          <div className="mt-4 w-full border-b border-gray-300 dark:border-gray-700"></div>
        </div>

        <div className="flex items-center gap-4">
          {["blue", "red", "green", "purple", "yellow", "pink"].map((color) => (
            <button
              key={color}
              onClick={() => changeTheme(color)}
              className={`relative h-6 w-6 rounded-full border-2 ${
                theme.name === color
                  ? "border-gray-800 dark:border-white"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            >
              {theme.name === color && (
                <Check className="absolute top-1 left-1 h-4 w-4 text-white dark:text-black" />
              )}
            </button>
          ))}

          {/* Custom Color Picker */}
          <input
            type="color"
            value={theme.isTailwind ? "#00ffff" : theme.buttonColor}
            onChange={(e) => changeTheme(e.target.value)}
            className="h-7 w-7 cursor-pointer rounded-full"
            style={{
              borderColor: theme.name === "custom" ? "#000" : "transparent",
              padding: 0,
            }}
          />
        </div>

        {!theme.isTailwind && (
          <p className="text-xs text-gray-800 dark:text-gray-400">
            Custom color: {theme.buttonColor}
          </p>
        )}
      </div>

      {/* Card 5: Danger Zone */}
      <div className="dark:bg-background space-y-4 rounded-2xl bg-white p-6 shadow-lg dark:text-white">
        <div>
          <h2 className="text-xl font-medium text-red-400">Danger Zone</h2>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            Deleting your workspace is irreversible. Make sure to back up any
            important data before proceeding.
          </p>
          <div className="mt-4 w-full border-b border-gray-300 dark:border-gray-700"></div>
        </div>

        <div className="flex flex-col items-start space-y-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-red-300 px-4 py-1.5 text-sm text-white hover:bg-red-400"
          >
            Delete Workspace
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            This will permanently delete all data associated with your
            workspace.
          </p>
        </div>
      </div>

      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="dark:bg-background w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Delete Workspace</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 dark:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Do you really want to delete this workspace? All users and posts
              within the workspace will be removed.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleDeleteWorkspace}
                className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-600 dark:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppearenceCard;
