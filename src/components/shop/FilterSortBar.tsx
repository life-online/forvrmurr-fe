import React, { useState, useEffect } from 'react';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';
import SortDrawer from './SortDrawer';
import FilterDrawer from './FilterDrawer';
import productService, { Brand, Note } from '@/services/product';

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
      <div className="max-w-7xl mx-auto w-full px-4 flex flex-col bg-white pb-6">
        {/* Top row - Product count and action buttons */}
        <div className="flex items-center justify-between pb-4">
          {/* Left side - Product count */}
          <div className="text-sm md:text-base">
            {isLoading ? (
              <span className="text-gray-500 flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-t-transparent border-gray-300 animate-spin"></span>
                <span>Loading products...</span>
              </span>
            ) : (
              <span>
                Showing <span className="font-medium text-[#a0001e]">{totalProducts}</span> {totalProducts === 1 ? 'product' : 'products'}
              </span>
            )}
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
            <span className="text-[#a0001e]">{getSortLabel(currentSortBy, currentSortOrder)}</span>
            <FiChevronDown size={16} />
          </button>
        </div>
        </div>
        
        {/* Filter chips row */}
        {filterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {filterChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => handleRemoveFilter(chip)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-800 transition-colors group"
              >
                {chip.label}
                <FiX size={14} className="text-gray-400 group-hover:text-[#a0001e]" />
              </button>
            ))}
            
            {filterChips.length > 1 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#a0001e] hover:text-[#7a0016] transition-colors ml-2"
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

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={onFiltersChange}
        totalProducts={totalProducts}
        isLoading={isLoading}
      />
    </>
  );
}
