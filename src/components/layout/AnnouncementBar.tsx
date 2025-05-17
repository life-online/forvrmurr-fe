"use client";

import React from 'react';

interface AnnouncementBarProps {
  message: string;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ message }) => {
  return (
    <div className="w-full bg-[#f1e4c8] text-[#8b0000] py-2 text-center text-sm font-medium">
      {message}
    </div>
  );
};

export default AnnouncementBar;
