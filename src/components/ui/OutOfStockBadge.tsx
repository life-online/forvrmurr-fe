"use client";

import React from "react";

interface OutOfStockBadgeProps {
  className?: string;
}

const OutOfStockBadge: React.FC<OutOfStockBadgeProps> = ({ className = "" }) => {
  return (
    <div className={`inline-block ${className}`}>
      <span className="bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-full">
        Out of Stock
      </span>
    </div>
  );
};

export default OutOfStockBadge;
