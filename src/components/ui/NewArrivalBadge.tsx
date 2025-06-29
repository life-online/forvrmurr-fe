import React from 'react';

interface NewArrivalBadgeProps {
  className?: string;
}

const NewArrivalBadge: React.FC<NewArrivalBadgeProps> = ({ className = '' }) => {
  return (
    <div 
      className={`relative ${className} z-20`}
      style={{ transform: 'rotate(-12deg)' }}
    >
      {/* Main badge */}
      <div className="relative flex items-center justify-center w-[72px] h-[72px] rounded-full bg-[#a0001e] border-2 border-white shadow-lg">
        <div className="text-center">
          <p className="text-[14px] font-bold text-white leading-none mb-1">LATEST</p>
          <p className="text-[12px] font-medium text-white leading-none">ARRIVAL</p>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalBadge;
