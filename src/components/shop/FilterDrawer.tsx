import React, { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { IoMdClose } from 'react-icons/io';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Image from 'next/image';
import productService, { Brand, Note } from '@/services/product';

// Define concentration item interface
interface ConcentrationItem {
  value: string;
  label: string;
}

export interface ShopFilters {
  minPrice: string;
  maxPrice: string;
  bestSeller: boolean;
  concentrations: string[];
  brands: string[];      // brand IDs (legacy)
  brandSlugs: string[];  // brand slugs for API filtering
  notes: string[];       // note IDs (legacy)
  noteSlugs: string[];   // note slugs for API filtering
  onSale: boolean;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ShopFilters;
  onFiltersChange: (filters: ShopFilters) => void;
  totalProducts: number;
  isLoading?: boolean;
}

// Concentration data will be fetched from API

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  totalProducts,
  isLoading = false,
}: FilterDrawerProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    brands: true,
    notes: true,
  });
  const [selectedBrandLetter, setSelectedBrandLetter] = useState<string>('A');
  const [selectedNoteLetter, setSelectedNoteLetter] = useState<string>('A');
  
  // State for API data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [concentrationItems, setConcentrationItems] = useState<ConcentrationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  
  // This effect runs once on component mount AND when the drawer becomes visible
  // Fetch concentrations separately
  useEffect(() => {
    if (!dataFetched || isOpen) {
      const fetchConcentrations = async () => {
        try {
          console.log("Fetching concentrations data...");
          const concentrationsData = await productService.getConcentrations();
          console.log("Concentrations from API:", concentrationsData);
          
          // Check if it's an array and not empty
          if (Array.isArray(concentrationsData) && concentrationsData.length > 0) {
            // Transform concentrations data from API to the required format
            // Backend now sends values with underscores already: ['eau_de_parfum', 'parfum']
            // We need to convert to [{value: 'eau_de_parfum', label: 'Eau de Parfum'}]
            const formattedConcentrations: ConcentrationItem[] = concentrationsData.map(item => {
              // For label: convert underscores to spaces and capitalize each word
              const label = item
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
                
              return {
                value: item, // Use as-is since backend already sends with underscores
                label // The formatted label with spaces and title case
              };
            });
            
            console.log("Formatted concentrations:", formattedConcentrations);
            setConcentrationItems(formattedConcentrations);
          } else {
            console.log("No concentration data received or invalid format:", concentrationsData);
            // Use default fallback concentrations if API fails
            const defaultConcentrations: ConcentrationItem[] = [
              { value: 'eau_de_parfum', label: 'Eau de Parfum' },
              { value: 'eau_de_toilette', label: 'Eau de Toilette' },
              { value: 'parfum', label: 'Parfum' }
            ];
            setConcentrationItems(defaultConcentrations);
            console.log("Using default concentrations instead");
          }
        } catch (error) {
          console.error('Error fetching concentration data:', error);
          // Fallback to defaults on error
          const defaultConcentrations: ConcentrationItem[] = [
            { value: 'eau_de_parfum', label: 'Eau de Parfum' },
            { value: 'eau_de_toilette', label: 'Eau de Toilette' },
            { value: 'parfum', label: 'Parfum' }
          ];
          setConcentrationItems(defaultConcentrations);
          console.log("Using default concentrations due to error");
        }
      };
      fetchConcentrations();
    }
  }, [isOpen, dataFetched]);
  
  // Fetch brands separately
  useEffect(() => {
    if (!dataFetched || isOpen) {
      const fetchBrands = async () => {
        try {
          console.log("Fetching brands data...");
          const brandsData = await productService.getBrands();
          console.log("Brands from API:", brandsData);
          setBrands(brandsData);
        } catch (error) {
          console.error('Error fetching brand data:', error);
          setBrands([]);
        }
      };
      fetchBrands();
    }
  }, [isOpen, dataFetched]);
  
  // Fetch notes separately
  useEffect(() => {
    if (!dataFetched || isOpen) {
      const fetchNotes = async () => {
        setLoading(true);
        try {
          console.log("Fetching notes data...");
          const notesData = await productService.getNotes();
          console.log("Notes from API:", notesData);
          setNotes(notesData);
          setDataFetched(true);
        } catch (error) {
          console.error('Error fetching notes data:', error);
          setNotes([]);
        } finally {
          setLoading(false);
        }
      };
      fetchNotes();
    }
  }, [isOpen, dataFetched]);

  // Group brands and notes by first letter
  const groupByLetter = (items: { id: string; name: string; [key: string]: any }[]) => {
    return items.reduce((acc, item) => {
      const firstLetter = item.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(item);
      return acc;
    }, {} as { [key: string]: { id: string; name: string; [key: string]: any }[] });
  };

  const brandsByLetter = groupByLetter(brands);
  const notesByLetter = groupByLetter(notes);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: value
    });
  };

  const handleConcentrationToggle = (concentration: string) => {
    const currentConcentrations = filters.concentrations || [];
    const newConcentrations = currentConcentrations.includes(concentration)
      ? currentConcentrations.filter((c: string) => c !== concentration)
      : [...currentConcentrations, concentration];
    
    onFiltersChange({
      ...filters,
      concentrations: newConcentrations
    });
  };

  const handleBrandToggle = (brandSlug: string) => {
    const currentBrands = filters.brandSlugs || [];
    const newBrands = currentBrands.includes(brandSlug)
      ? currentBrands.filter((slug: string) => slug !== brandSlug)
      : [...currentBrands, brandSlug];
    
    onFiltersChange({
      ...filters,
      brandSlugs: newBrands
    });
  };

  const handleNoteToggle = (noteSlug: string) => {
    const currentNotes = filters.noteSlugs || [];
    const newNotes = currentNotes.includes(noteSlug)
      ? currentNotes.filter((slug: string) => slug !== noteSlug)
      : [...currentNotes, noteSlug];
    
    onFiltersChange({
      ...filters,
      noteSlugs: newNotes
    });
  };

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

  const getSelectedBrandsByLetter = () => {
    if (!selectedBrandLetter || !brandsByLetter[selectedBrandLetter]) return [];
    return brandsByLetter[selectedBrandLetter];
  };

  const getSelectedNotesByLetter = () => {
    if (!selectedNoteLetter || !notesByLetter[selectedNoteLetter]) return [];
    return notesByLetter[selectedNoteLetter];
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className="fixed top-0 right-0 w-full sm:w-[480px] h-screen bg-white z-50 flex flex-col"
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            overscrollBehavior: "contain",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <Drawer.Title className="text-xl font-medium text-black">
              Filters
            </Drawer.Title>
            <IoMdClose
              size={24}
              onClick={onClose}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
            />
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Loading filters...</p>
              </div>
            )}
            
            {/* Active Filters */}
            {!loading && (filters.brands?.length > 0 || filters.notes?.length > 0 || 
              filters.concentrations?.length > 0 || filters.bestSeller || 
              filters.minPrice || filters.maxPrice) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Active:</span>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear all ✕
                </button>
              </div>
            )}

            {/* Price Range */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0001e] focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0001e] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Best Seller Toggle */}
            <div >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.bestSeller || false}
                  onChange={(e) => onFiltersChange({ ...filters, bestSeller: e.target.checked })}
                  className="w-4 h-4 text-[#a0001e] border-gray-300 rounded focus:ring-[#a0001e]"
                />
                <span className="font-medium text-gray-900">Best Seller</span>
              </label>
            </div>

            {/* Concentrations */}
            <div className='py-4'>
              <h3 className="font-medium text-gray-900 mb-4">Concentrations</h3>
              <div className="space-y-2">
                {concentrationItems.map((concentration: ConcentrationItem) => (
                  <label key={concentration.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.concentrations?.includes(concentration.value) || false}
                      onChange={() => handleConcentrationToggle(concentration.value)}
                      className="w-4 h-4 text-[#a0001e] border-gray-300 rounded focus:ring-[#a0001e]"
                    />
                    <span className="text-gray-700">{concentration.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className='py-4'>
              <button
                onClick={() => toggleSection('brands')}
                className="flex items-center justify-between w-full font-medium text-gray-900 mb-4"
              >
                <span>Filter by Brands ({filters.brandSlugs?.length || 0})</span>
                {expandedSections.brands ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedSections.brands && (
                <div className="space-y-4">
                  {/* Brands Grid for Selected Letter */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {getSelectedBrandsByLetter().map((brand) => (
                      <div
                        key={brand.id}
                        onClick={() => handleBrandToggle(brand.slug)}
                        className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                          filters.brandSlugs?.includes(brand.slug)
                            ? 'border-[#a0001e] bg-[#faf0e2]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{brand.name}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Alphabet Navigation */}
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(brandsByLetter).sort().map((letter) => (
                      <button
                        key={letter}
                        onClick={() => setSelectedBrandLetter(letter)}
                        className={`w-8 h-8 flex items-center justify-center border rounded text-sm font-medium ${
                          selectedBrandLetter === letter
                            ? 'border-[#a0001e] bg-[#faf0e2] font-bold'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className='py-4'>
              <button
                onClick={() => toggleSection('notes')}
                className="flex items-center justify-between w-full font-medium text-gray-900 mb-4"
              >
                <span>Filter by Perfume Notes ({filters.noteSlugs?.length || 0})</span>
                {expandedSections.notes ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedSections.notes && (
                <div className="space-y-4">
                  {/* Notes Grid for Selected Letter */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {getSelectedNotesByLetter().map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleNoteToggle(note.slug)}
                        className={`p-2 border rounded-lg cursor-pointer text-center transition-colors ${
                          filters.noteSlugs?.includes(note.slug)
                            ? 'border-[#a0001e] bg-[#faf0e2]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-8 h-8 mx-auto mb-1 relative">
                          <Image
                            src={`/images${note.iconUrl}` || '/images/notes/default-note.png'}
                            alt={note.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="text-xs">{note.name}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Alphabet Navigation */}
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(notesByLetter).sort().map((letter) => (
                      <button
                        key={letter}
                        onClick={() => setSelectedNoteLetter(letter)}
                        className={`w-8 h-8 flex items-center justify-center border rounded text-sm font-medium ${
                          selectedNoteLetter === letter
                            ? 'border-[#a0001e] bg-[#faf0e2] font-bold'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sale Toggle */}
            {/* <div className="bg-[#faf0e2] p-4 rounded-lg">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-[#8B4513]">SALE! UP TO 60% OFF</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.onSale || false}
                    onChange={(e) => onFiltersChange({ ...filters, onSale: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    filters.onSale ? 'bg-[#8B4513]' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      filters.onSale ? 'translate-x-6' : 'translate-x-0.5'
                    } mt-0.5`} />
                  </div>
                </div>
              </label>
            </div> */}
          </div>

          {/* Bottom Action */}
          <div className="border-t border-gray-100 p-6">
            <div className="text-sm text-gray-600 mb-4">
              {isLoading ? 'Loading...' : `Showing ${totalProducts} products`}
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              VIEW RESULTS
            </button>
            <button
              onClick={clearAllFilters}
              className="w-full py-3 px-4 mt-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
            >
              Clear all
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
