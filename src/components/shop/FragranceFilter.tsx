/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Drawer } from "vaul";
import productService from "@/services/product";
import { IoMdClose } from "react-icons/io";

interface FragranceFilterProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  selectedFilters: {
    [key: string]: string | null;
  };
  setSelectedFilters: (filters: { [key: string]: string | null }) => void;
  updateSearchParams: (filters: { [key: string]: string | null }) => void;
  filteredProductCount?: number;
  isLoading?: boolean;
}

const categories = [
  { label: "Scent Type", imageUrl: "/images/scent_notes/face.png" },
  { label: "Occasion", imageUrl: "/images/scent_notes/daytime.jpg" },
  { label: "Family", imageUrl: "/images/scent_notes/woody.jpg" },
  { label: "Mood", imageUrl: "/images/scent_notes/main_character.jpg" },
];

export default function FragranceSelector({
  drawerOpen,
  setDrawerOpen,
  selectedFilters,
  setSelectedFilters,
  updateSearchParams,
  filteredProductCount = 0,
  isLoading = false,
}: FragranceFilterProps) {
  const [fragranceFamilies, setFragranceFamilies] = useState<any[]>([]);
  const [productOccasions, setProductOccasions] = useState<any[]>([]);
  const [scentTypes, setScentTypes] = useState<any[]>([]);
  const [productMoods, setProductMoods] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    console.log("Selected Filters:", selectedFilters);
  }, [selectedFilters]);

  const handleSubcategoryClick = (section: string, slug: string) => {
    const newFilters = { ...selectedFilters };
    if (newFilters[section] === slug) {
      // If already selected, deselect it
      newFilters[section] = null;
    } else {
      // Otherwise, select it
      newFilters[section] = slug;
    }
    setSelectedFilters(newFilters);
    updateSearchParams(newFilters);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [families, occasions, scents, moods] = await Promise.all([
          productService.getFragranceFamilies(),
          productService.getProductOccasions(),
          productService.getScentTypes(),
          productService.getProductMoods(),
        ]);
        setFragranceFamilies(families?.data?.map((item: any) => item) || []);
        setProductOccasions(occasions?.data?.map((item: any) => item) || []);
        setScentTypes(scents?.data?.map((item: any) => item) || []);
        setProductMoods(moods?.data?.map((item: any) => item) || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedFilters({
      "Scent Type": params.get("scentTypeSlugs"),
      Occasion: params.get("occasionSlugs"),
      "Fragrance Family": params.get("fragranceFamilySlugs"),
      Mood: params.get("moodSlugs"),
    });
  }, []);
  useEffect(() => {
    if (drawerOpen && selectedCategory) {
      const scrollToSection = () => {
        const element = document.getElementById(selectedCategory);
        console.log("element", "to be scrolled");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      // Timeout ensures the modal is rendered before scrolling
      const timeout = setTimeout(scrollToSection, 100);

      return () => clearTimeout(timeout);
    }
  }, [drawerOpen, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 sm:p-6 mb-2">
      <div 
        className="flex overflow-x-auto pb-2 -mx-2 md:px-2 items-start gap-3 sm:gap-6 sm:justify-between"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="text-center cursor-pointer min-w-[90px] sm:min-w-0 sm:flex-1 flex-shrink-0"
            onClick={() => {
              setDrawerOpen(true);
              setSelectedCategory(cat.label);
            }}
          >
            <div className="w-[90px] sm:w-full h-[120px] sm:h-26 rounded-md flex items-center justify-center overflow-hidden">
              <Image
                src={cat.imageUrl}
                alt={cat.label}
                width={300}
                height={200}
                className="object-cover rounded-md h-full w-full transition-transform hover:scale-105 duration-300"
                priority={idx < 4} // Load all 4 category images immediately
                loading="eager" // Ensure eager loading for better UX
              />
            </div>
            <p className="text-sm text-gray-700 mt-1 font-medium">{cat.label}</p>
          </div>
        ))}
      </div>

      <Drawer.Root
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        direction="right"
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Drawer.Content
            className="fixed top-0 right-0 w-full sm:w-[480px] h-screen bg-white z-50 flex flex-col overflow-hidden"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
              overscrollBehavior: "contain",
            }}
          >
            {/* Header - Scrollable */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
              <Drawer.Title className="text-lg sm:text-xl font-medium text-black">
                Personalize
              </Drawer.Title>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <IoMdClose
                  size={20}
                  className="text-gray-500 hover:text-gray-700"
                />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-y-contain">
              {Object.entries({
                "Scent Type": scentTypes,
                "Fragrance Family": fragranceFamilies,
                Mood: productMoods,
                Occasion: productOccasions,
              }).map(([section, items]) => (
                <div key={section} id={`${section}`} className="md:mb-12 mb-8">
                  <h3 className="text text-gray-700 mb-3">{section}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <div
                        key={item.slug}
                        className={`p-[0.1em] rounded-lg border-2 ${
                          selectedFilters[section] === item.slug
                            ? "border-[#8B0000]"
                            : "border-transparent"
                        } ${
                          selectedFilters[section] &&
                          selectedFilters[section] !== item.slug
                            ? "opacity-50"
                            : ""
                        }`}
                      >
                        <div
                          onClick={() =>
                            handleSubcategoryClick(section, item.slug)
                          }
                          className={`relative w-[65px] h-[65px] sm:w-24 sm:h-24 rounded-md overflow-hidden cursor-pointer transition-all duration-200`}
                        >
                          <Image
                            src={`/images${item.iconUrl}` || "/images/shop/occassion.jpg"}
                            alt={item.slug}
                            width={1000}
                            height={1000}
                            className="object-cover h-full rounded-md"
                            loading="eager" // Load all subcategory images immediately for better UX
                            priority // Prioritize these images in the drawer
                          />
                          <div className="absolute bottom-0 left-0 right-0 text-[10px] sm:text-xs text-white bg-black/60 text-center py-0.5 sm:py-1 line-clamp-1">
                            {item.slug
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (char: any) =>
                                char.toUpperCase()
                              )}
                          </div>
                          {selectedFilters[section] &&
                            selectedFilters[section] !== item.slug && (
                              <div className="absolute inset-0 bg-white/40 rounded-md"></div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-gray-100 p-4 sm:p-6 space-y-3 safe-area-pb">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {isLoading
                  ? "LOADING..."
                  : Object.values(selectedFilters).filter(
                      (filter) => filter !== null
                    ).length === 0
                  ? "NO FILTERS APPLIED"
                  : `${filteredProductCount} ${filteredProductCount === 1 ? 'PRODUCT' : 'PRODUCTS'} FOUND`}
              </button>
              <button
                onClick={() => {
                  const cleared = {
                    "Scent Type": null,
                    Occasion: null,
                    "Fragrance Family": null,
                    Mood: null,
                  };
                  setSelectedFilters(cleared);
                  updateSearchParams(cleared);
                }}
                className="w-full py-3 px-4 text-gray-600 font-medium hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
