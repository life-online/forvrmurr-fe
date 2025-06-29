import React, { useState } from 'react';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import SortDrawer from './SortDrawer';
import FilterDrawer from './FilterDrawer';

interface FilterSortBarProps {
  totalProducts: number;
  currentSort: string;
  onSortChange: (sort: string) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function FilterSortBar({
  totalProducts,
  currentSort,
  onSortChange,
  filters,
  onFiltersChange,
}: FilterSortBarProps) {
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const getSortLabel = (sortValue: string) => {
    switch (sortValue) {
      case 'name_asc':
        return 'Name A-Z';
      case 'name_desc':
        return 'Name Z-A';
      case 'price_asc':
        return 'Price Low to High';
      case 'price_desc':
        return 'Price High to Low';
      case 'newest':
        return 'Newest';
      case 'best_seller':
        return 'Best Seller';
      default:
        return 'Sort by';
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.bestSeller) count++;
    if (filters.concentrations?.length > 0) count++;
    if (filters.brands?.length > 0) count++;
    if (filters.notes?.length > 0) count++;
    return count;
  };

  return (
    <>
      <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between pb-12 bg-white">
        {/* Left side - Product count */}
        <div className="text-sm text-gray-600">
          Showing {totalProducts} products
        </div>

        {/* Right side - Filter and Sort buttons */}
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <FiFilter size={16} />
            <span>Filter</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-[#a0001e] text-white text-xs rounded-full px-2 py-0.5 ml-1">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>

          {/* Sort Button */}
          <button
            onClick={() => setSortDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <span>Sort by</span>
            <span className="text-gray-500">|</span>
            <span className="text-[#a0001e]">{getSortLabel(currentSort)}</span>
            <FiChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Sort Drawer */}
      <SortDrawer
        isOpen={sortDrawerOpen}
        onClose={() => setSortDrawerOpen(false)}
        currentSort={currentSort}
        onSortChange={onSortChange}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={onFiltersChange}
        totalProducts={totalProducts}
      />
    </>
  );
}
