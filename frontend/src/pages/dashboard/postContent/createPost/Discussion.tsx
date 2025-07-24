import { Send, User } from "lucide-react";
import React from "react";

const Discussion = () => {
  return (
    <>
      <div className="w-full">
        <div className="flex h-80 items-center justify-center">
          No comments yet.
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="rounded-full bg-black p-2">
            <User className="text-white" />
          </div>
          <div className="w-full">
            <input
              type="text"
              className="w-full rounded bg-gray-200 p-2"
              placeholder="Enter your comment"
            />
          </div>
          <div>
            <Send />
          </div>
        </div>
      </div>
    </>
  );
};

export default Discussion;
