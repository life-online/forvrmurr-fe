import React, { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { IoMdClose } from 'react-icons/io';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Image from 'next/image';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  totalProducts: number;
}

// Mock data - replace with actual API calls
const mockBrands = [
  { id: '1', name: 'Armani', logo: '/images/brands/armani.png' },
  { id: '2', name: 'Burberry', logo: '/images/brands/burberry.png' },
  { id: '3', name: 'Calvin Klein', logo: '/images/brands/calvin.png' },
  { id: '4', name: 'Dolce&Gabbana', logo: '/images/brands/dolce.png' },
  { id: '5', name: 'Gucci', logo: '/images/brands/gucci.png' },
  { id: '6', name: 'Hugo Boss', logo: '/images/brands/hugo.png' },
  { id: '7', name: 'Prada', logo: '/images/brands/prada.png' },
  { id: '8', name: 'Sanctuary', logo: '/images/brands/sanctuary.png' },
  { id: '9', name: 'Versace', logo: '/images/brands/versace.png' },
];

const mockNotes = [
  { id: '1', name: 'Amber', iconUrl: '/images/scent_notes/amber.png' },
  { id: '2', name: 'Bergamot', iconUrl: '/images/scent_notes/bergamot.png' },
  { id: '3', name: 'Caramel', iconUrl: '/images/scent_notes/caramel.png' },
  { id: '4', name: 'Cedar', iconUrl: '/images/scent_notes/cedar.png' },
  { id: '5', name: 'Citrus', iconUrl: '/images/scent_notes/citrus.png' },
  { id: '6', name: 'Jasmine', iconUrl: '/images/scent_notes/jasmine.png' },
  { id: '7', name: 'Lavender', iconUrl: '/images/scent_notes/lavender.png' },
  { id: '8', name: 'Musk', iconUrl: '/images/scent_notes/musk.png' },
  { id: '9', name: 'Rose', iconUrl: '/images/scent_notes/rose.png' },
  { id: '10', name: 'Vanilla', iconUrl: '/images/scent_notes/vanilla.png' },
];

const concentrations = [
  { value: 'eau_de_parfum', label: 'Eau de Parfum' },
  { value: 'eau_de_toilette', label: 'Eau de Toilette' },
  { value: 'eau_de_cologne', label: 'Eau de Cologne' },
  { value: 'parfum', label: 'Parfum' },
];

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  totalProducts,
}: FilterDrawerProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    brands: false,
    notes: false,
  });
  const [selectedBrandLetter, setSelectedBrandLetter] = useState<string>('');
  const [selectedNoteLetter, setSelectedNoteLetter] = useState<string>('');

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

  const brandsByLetter = groupByLetter(mockBrands);
  const notesByLetter = groupByLetter(mockNotes);

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

  const handleBrandToggle = (brandId: string) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brandId)
      ? currentBrands.filter((b: string) => b !== brandId)
      : [...currentBrands, brandId];
    
    onFiltersChange({
      ...filters,
      brands: newBrands
    });
  };

  const handleNoteToggle = (noteId: string) => {
    const currentNotes = filters.notes || [];
    const newNotes = currentNotes.includes(noteId)
      ? currentNotes.filter((n: string) => n !== noteId)
      : [...currentNotes, noteId];
    
    onFiltersChange({
      ...filters,
      notes: newNotes
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      minPrice: '',
      maxPrice: '',
      bestSeller: false,
      concentrations: [],
      brands: [],
      notes: []
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
            {/* Active Filters */}
            {(filters.brands?.length > 0 || filters.notes?.length > 0) && (
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
            <div>
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
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Concentrations</h3>
              <div className="space-y-2">
                {concentrations.map((concentration) => (
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
            <div>
              <button
                onClick={() => toggleSection('brands')}
                className="flex items-center justify-between w-full font-medium text-gray-900 mb-4"
              >
                <span>FILTER BY BRANDS ({filters.brands?.length || 0})</span>
                {expandedSections.brands ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedSections.brands && (
                <div className="space-y-4">
                  {/* Brand Letter Selection */}
                  {!selectedBrandLetter ? (
                    <>
                      {/* Featured Brands */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {mockBrands.slice(0, 3).map((brand) => (
                          <div
                            key={brand.id}
                            onClick={() => handleBrandToggle(brand.id)}
                            className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                              filters.brands?.includes(brand.id)
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
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
                          >
                            {letter}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Back Button */}
                      <button
                        onClick={() => setSelectedBrandLetter('')}
                        className="text-sm text-[#a0001e] hover:underline mb-3"
                      >
                        ← Back to all brands
                      </button>
                      
                      {/* Brands for Selected Letter */}
                      <div className="space-y-2">
                        {getSelectedBrandsByLetter().map((brand) => (
                          <label key={brand.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.brands?.includes(brand.id) || false}
                              onChange={() => handleBrandToggle(brand.id)}
                              className="w-4 h-4 text-[#a0001e] border-gray-300 rounded focus:ring-[#a0001e]"
                            />
                            <span className="text-gray-700">{brand.name}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <button
                onClick={() => toggleSection('notes')}
                className="flex items-center justify-between w-full font-medium text-gray-900 mb-4"
              >
                <span>FILTER BY PERFUME NOTES</span>
                {expandedSections.notes ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedSections.notes && (
                <div className="space-y-4">
                  {/* Note Letter Selection */}
                  {!selectedNoteLetter ? (
                    <>
                      {/* Featured Notes */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {mockNotes.slice(0, 4).map((note) => (
                          <div
                            key={note.id}
                            onClick={() => handleNoteToggle(note.id)}
                            className={`p-2 border rounded-lg cursor-pointer text-center transition-colors ${
                              filters.notes?.includes(note.id)
                                ? 'border-[#a0001e] bg-[#faf0e2]'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="w-8 h-8 mx-auto mb-1 relative">
                              <Image
                                src={note.iconUrl}
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
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
                          >
                            {letter}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Back Button */}
                      <button
                        onClick={() => setSelectedNoteLetter('')}
                        className="text-sm text-[#a0001e] hover:underline mb-3"
                      >
                        ← Back to all notes
                      </button>
                      
                      {/* Notes for Selected Letter */}
                      <div className="space-y-2">
                        {getSelectedNotesByLetter().map((note) => (
                          <label key={note.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.notes?.includes(note.id) || false}
                              onChange={() => handleNoteToggle(note.id)}
                              className="w-4 h-4 text-[#a0001e] border-gray-300 rounded focus:ring-[#a0001e]"
                            />
                            <span className="text-gray-700">{note.name}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
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

          {/* Bottom Actions */}
          <div className="border-t border-gray-100 p-6 space-y-3">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              SHOW {totalProducts} PRODUCT RESULTS
            </button>
            <button
              onClick={clearAllFilters}
              className="w-full py-3 px-4 text-gray-600 font-medium hover:text-gray-800 transition-colors"
            >
              Clear all
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
