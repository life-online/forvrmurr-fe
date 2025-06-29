import React from 'react';
import { Drawer } from 'vaul';
import { IoMdClose } from 'react-icons/io';
import { FiCheck } from 'react-icons/fi';

interface SortDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSortBy: string;
  currentSortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

const sortOptions = [
  { value: 'default', label: 'Default sorting', sortOrder: 'ASC' },
  { value: 'name', label: 'By name (A-Z)', sortOrder: 'ASC' },
  { value: 'name', label: 'By name (Z-A)', sortOrder: 'DESC' },
  { value: 'price', label: 'By price (low to high)', sortOrder: 'ASC' },
  { value: 'price', label: 'By price (high to low)', sortOrder: 'DESC' },
  { value: 'best_sellers', label: 'By popularity', sortOrder: 'ASC' },
  { value: 'newest', label: 'New arrivals', sortOrder: 'DESC' },
];

export default function SortDrawer({
  isOpen,
  onClose,
  currentSortBy,
  currentSortOrder,
  onSortChange,
}: SortDrawerProps) {
  const handleSortSelect = (sortBy: string, sortOrder: string) => {
    onSortChange(sortBy, sortOrder);
    onClose();
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className="fixed top-0 right-0 w-full sm:w-[400px] h-screen bg-white z-50 flex flex-col"
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            overscrollBehavior: "contain",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <Drawer.Title className="text-xl font-medium text-black">
              Sort results
            </Drawer.Title>
            <IoMdClose
              size={24}
              onClick={onClose}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
            />
          </div>

          {/* Sort Options */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {sortOptions.map((option) => (
                <button
                  key={`${option.value}-${option.sortOrder}`}
                  onClick={() => handleSortSelect(option.value, option.sortOrder)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    currentSortBy === option.value && currentSortOrder === option.sortOrder
                      ? 'bg-[#faf0e2] border-[#e6c789] text-[#600000]'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-left font-medium">{option.label}</span>
                  {currentSortBy === option.value && currentSortOrder === option.sortOrder && (
                    <FiCheck size={20} className="text-[#600000]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="border-t border-gray-100 p-6">
            <button
              onClick={() => handleSortSelect('default', 'ASC')}
              className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              SORT BY {sortOptions.find(opt => opt.value === currentSortBy && opt.sortOrder === currentSortOrder)?.label.toUpperCase() || 'DEFAULT'}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 mt-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
