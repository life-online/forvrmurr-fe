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
  { label: "Fragrance Family", imageUrl: "/images/scent_notes/woody.jpg" },
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
    <div className="max-w-7xl mx-auto w-full px-4 sm:p-6 mb-2">
      <div className="flex justify-between items-start gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="text-center cursor-pointer flex-1"
            onClick={() => {
              setDrawerOpen(true);
              setSelectedCategory(cat.label);
            }}
          >
            <div className="w-full h-32 sm:h-26 rounded-md flex items-center justify-center">
              <Image
                src={cat.imageUrl}
                alt="pic"
                width={600}
                height={300}
                className="object-cover rounded-md h-full w-full"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{cat.label}</p>
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
            <div className="flex justify-between items-center p-6 border-b border-gray-100 overflow-x-auto">
              <Drawer.Title className="text-xl font-medium text-black">
                Personalize
              </Drawer.Title>
              <IoMdClose
                size={24}
                onClick={() => setDrawerOpen(false)}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 overscroll-y-contain">
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
                        className={`p-[0.1em] rounded-lg border-3 ${
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
                          key={item.slug}
                          onClick={() =>
                            handleSubcategoryClick(section, item.slug)
                          }
                          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden cursor-pointer transition-all duration-200`}
                        >
                          <Image
                            src={item.iconUrl || "/images/shop/occassion.jpg"}
                            alt={item.slug}
                            width={1000}
                            height={1000}
                            className="object-cover h-full rounded-md"
                          />
                          <div className="absolute bottom-0 left-0 right-0 text-xs text-white bg-black/50 text-center py-1">
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
            <div className="border-t border-gray-100 p-6 space-y-3">
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
                  : `SHOWING ${filteredProductCount} PRODUCT RESULTS`}
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
