"use client";

import React, { Dispatch, SetStateAction } from "react";

// Types

interface SideBarrops {
  isOpen: boolean;
  onClose: () => void;
  onClickView: (dir: string) => void;
  view: string;
  setHoveredDir: Dispatch<SetStateAction<string | undefined>>;
  hoveredDir: string | undefined;
  dirs: string[];
}

const ProfileMobileSideBar: React.FC<SideBarrops> = ({
  isOpen,
  onClose,
  onClickView,
  view,
  setHoveredDir,
  hoveredDir,
  dirs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="fixed inset-y-0 left-0 max-w-md w-full bg-white shadow-xl flex flex-col">
        <div className="flex flex-col gap-5 p-5 ">
          <p className="text-xl  text-black font-semibold">Hello,</p>
          <div className="flex flex-col gap-4">
            {dirs.map((item, index) => (
              <div
                className="flex items-center gap-1  cursor-pointer"
                key={index}
                onClick={() => onClickView(item)}
                onMouseEnter={() => setHoveredDir(item)}
                onMouseLeave={() => setHoveredDir(undefined)}
              >
                <div
                  className={`h-7 ${
                    view === item || hoveredDir === item
                      ? "opacity-100"
                      : "opacity-1"
                  } ease-in-out duration-500 border-2 rounded-full border-[#C8102E]`}
                ></div>

                <p
                  className={`px-3 w-full py-1 text-black hover:bg-white ease-in-out ${
                    view === item ? "bg-white" : ""
                  } duration-500 rounded-lg`}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMobileSideBar;
