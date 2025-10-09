import React, { useState, useEffect, lazy, Suspense } from 'react';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';
import SortDrawer from './SortDrawer';
import productService, { Brand, Note } from '@/services/product';

// Lazy load FilterDrawer - only loaded when filter button is clicked
const FilterDrawer = lazy(() => import('./FilterDrawer'));

interface FilterSortBarProps {
  totalProducts: number;
  currentSortBy: string;
  currentSortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  isLoading?: boolean;
}

interface FilterChip {
  key: string;
  label: string;
  value: string;
  filterType: string;
}

export default function FilterSortBar({
  totalProducts,
  currentSortBy,
  currentSortOrder,
  onSortChange,
  filters,
  onFiltersChange,
  isLoading = false,
}: FilterSortBarProps) {
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [filterChips, setFilterChips] = useState<FilterChip[]>([]);
  
  // Fetch brands and notes for display in filter chips
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [brandsData, notesData] = await Promise.all([
          productService.getBrands(),
          productService.getNotes()
        ]);
        setAllBrands(brandsData);
        setAllNotes(notesData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    
    fetchFiltersData();
  }, []);

  const getSortLabel = (sortBy: string, sortOrder: string) => {
    if (sortBy === 'default') return 'Sort by';
    
    if (sortBy === 'name') {
      return sortOrder === 'ASC' ? 'Name A-Z' : 'Name Z-A';
    }
    if (sortBy === 'price') {
      return sortOrder === 'ASC' ? 'Price Low to High' : 'Price High to Low';
    }
    if (sortBy === 'best_sellers') {
      return 'Best Sellers';
    }
    if (sortBy === 'newest') {
      return 'Newest';
    }
    
    return 'Sort by';
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.bestSeller) count++;
    if (filters.concentrations?.length > 0) count++;
    if (filters.brands?.length > 0) count++;
    if (filters.brandSlugs?.length > 0) count++;
    if (filters.notes?.length > 0) count++;
    if (filters.noteSlugs?.length > 0) count++;
    if (filters.onSale) count++;
    return count;
  };
  
  // Generate filter chips based on active filters
  useEffect(() => {
    const chips: FilterChip[] = [];
    
    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      let priceLabel = '';
      if (filters.minPrice && filters.maxPrice) {
        priceLabel = `$${filters.minPrice} - $${filters.maxPrice}`;
      } else if (filters.minPrice) {
        priceLabel = `Min $${filters.minPrice}`;
      } else if (filters.maxPrice) {
        priceLabel = `Max $${filters.maxPrice}`;
      }
      
      chips.push({
        key: 'price',
        label: priceLabel,
        value: 'price',
        filterType: 'price'
      });
    }
    
    // Best seller filter
    if (filters.bestSeller) {
      chips.push({
        key: 'bestSeller',
        label: 'Best Seller',
        value: 'bestSeller',
        filterType: 'bestSeller'
      });
    }
    
    // On sale filter
    if (filters.onSale) {
      chips.push({
        key: 'onSale',
        label: 'On Sale',
        value: 'onSale',
        filterType: 'onSale'
      });
    }
    
    // Concentration filters
    if (filters.concentrations?.length > 0) {
      filters.concentrations.forEach((concentration: string) => {
        // Format concentration label (e.g., eau_de_parfum -> Eau de Parfum)
        const label = concentration
          .replace(/_/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        chips.push({
          key: `concentration-${concentration}`,
          label: label,
          value: concentration,
          filterType: 'concentration'
        });
      });
    }
    
    // Brand filters using brandSlugs
    if (filters.brandSlugs?.length > 0) {
      filters.brandSlugs.forEach((brandSlug: string) => {
        const brand = allBrands.find(b => b.slug === brandSlug);
        chips.push({
          key: `brand-${brandSlug}`,
          label: brand ? brand.name : brandSlug,
          value: brandSlug,
          filterType: 'brandSlug'
        });
      });
    }
    
    // Note filters using noteSlugs
    if (filters.noteSlugs?.length > 0) {
      filters.noteSlugs.forEach((noteSlug: string) => {
        const note = allNotes.find(n => n.slug === noteSlug);
        chips.push({
          key: `note-${noteSlug}`,
          label: note ? note.name : noteSlug,
          value: noteSlug,
          filterType: 'noteSlug'
        });
      });
    }
    
    setFilterChips(chips);
  }, [filters, allBrands, allNotes]);
  
  // Handle removing a single filter
  const handleRemoveFilter = (chip: FilterChip) => {
    const newFilters = { ...filters };
    
    switch(chip.filterType) {
      case 'price':
        newFilters.minPrice = '';
        newFilters.maxPrice = '';
        break;
      case 'bestSeller':
        newFilters.bestSeller = false;
        break;
      case 'onSale':
        newFilters.onSale = false;
        break;
      case 'concentration':
        newFilters.concentrations = newFilters.concentrations.filter(
          (c: string) => c !== chip.value
        );
        break;
      case 'brandSlug':
        newFilters.brandSlugs = newFilters.brandSlugs.filter(
          (b: string) => b !== chip.value
        );
        break;
      case 'noteSlug':
        newFilters.noteSlugs = newFilters.noteSlugs.filter(
          (n: string) => n !== chip.value
        );
        break;
      default:
        break;
    }
    
    onFiltersChange(newFilters);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({
      minPrice: '',
      maxPrice: '',
      bestSeller: false,
      concentrations: [],
      brands: [],
      brandSlugs: [],
      notes: [],
      noteSlugs: [],
      onSale: false
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 flex flex-col bg-white pb-4 sm:pb-6">
        {/* Top row - Product count and action buttons */}
        <div className="flex items-center justify-between pb-3">
          {/* Left side - Product count */}
          <div className="text-sm md:text-base whitespace-nowrap pr-2">
            {isLoading ? (
              <span className="text-gray-500 flex items-center gap-1 sm:gap-2">
                <span className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-t-transparent border-gray-300 animate-spin"></span>
                <span className="truncate">Loading products...</span>
              </span>
            ) : (
              <span>
                Showing <span className="font-medium text-[#a0001e]">{totalProducts}</span> {totalProducts === 1 ? 'product' : 'products'}
              </span>
            )}
          </div>

          {/* Right side - Filter and Sort buttons */}
          <div className="flex items-center gap-2">
          {/* Filter Button */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors min-w-[70px] justify-center"
          >
            <FiFilter size={14} className="flex-shrink-0" />
            <span className="hidden xs:inline">Filter</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-[#a0001e] text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 inline-flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>

          {/* Sort Button */}
          <button
            onClick={() => setSortDrawerOpen(true)}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors truncate max-w-[130px] sm:max-w-none"
          >
            
            <span className="md:inline hidden">Sort</span>
            <span className="text-gray-500 hidden md:inline">|</span>
            <span className="text-[#a0001e] truncate">{getSortLabel(currentSortBy, currentSortOrder)}</span>
            <FiChevronDown size={14} className="flex-shrink-0" />
          </button>
        </div>
        </div>
        
        {/* Filter chips row - scrollable on mobile */}
        {filterChips.length > 0 && (
          <div 
            className="flex overflow-x-auto pb-2 -mx-2 px-2 sm:flex-wrap sm:mx-0 sm:px-0 items-center gap-2 mt-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {filterChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => handleRemoveFilter(chip)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm font-medium text-gray-800 transition-colors group whitespace-nowrap flex-shrink-0"
              >
                <span className="truncate max-w-[100px] sm:max-w-[150px]">{chip.label}</span>
                <FiX size={12} className="text-gray-400 group-hover:text-[#a0001e] flex-shrink-0" />
              </button>
            ))}
            
            {filterChips.length > 1 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-[#a0001e] hover:text-[#7a0016] transition-colors whitespace-nowrap flex-shrink-0"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sort Drawer */}
      <SortDrawer
        isOpen={sortDrawerOpen}
        onClose={() => setSortDrawerOpen(false)}
        currentSortBy={currentSortBy}
        currentSortOrder={currentSortOrder}
        onSortChange={onSortChange}
      />

      {/* Filter Drawer - Lazy loaded */}
      {filterDrawerOpen && (
        <Suspense fallback={<div />}>
          <FilterDrawer
            isOpen={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            filters={filters}
            onFiltersChange={onFiltersChange}
            totalProducts={totalProducts}
            isLoading={isLoading}
          />
        </Suspense>
      )}
    </>
  );
}
