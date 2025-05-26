/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Drawer } from "vaul";
import productService from "@/services/product";
import { IoMdClose } from "react-icons/io";

const categories = [
  { label: "Scent Type", imageUrl: "/images/scent_notes/face.png" },
  // { label: "Concentration", imageUrl: "/images/scent_notes/yellowFlower.png" },
  { label: "Occasion", imageUrl: "/images/scent_notes/musk.png" },
  { label: "Fragrance Family", imageUrl: "/images/scent_notes/citrus.png" },
  { label: "Mood", imageUrl: "/images/scent_notes/redPics.png" },
];

export default function FragranceSelector() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fragranceFamilies, setFragranceFamilies] = useState<any[]>([]);
  const [productOccasions, setProductOccasions] = useState<any[]>([]);
  const [scentTypes, setScentTypes] = useState<any[]>([]);
  const [productMoods, setProductMoods] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string | null;
  }>({
    "Scent Type": null,
    Occasion: null,
    "Fragrance Family": null,
    Mood: null,
  });

  useEffect(() => {
    console.log("Selected Filters:", selectedFilters);
  }, [selectedFilters]);

  const updateSearchParams = (updatedFilters: {
    [key: string]: string | null;
  }) => {
    const params = new URLSearchParams(window.location.search);

    if (updatedFilters["Scent Type"]) {
      params.set("scentTypeSlugs", updatedFilters["Scent Type"]!);
    } else {
      params.delete("scentTypeSlugs");
    }
    if (updatedFilters["Occasion"]) {
      params.set("occasionSlugs", updatedFilters["Occasion"]!);
    } else {
      params.delete("occasionSlugs");
    }
    if (updatedFilters["Fragrance Family"]) {
      params.set("fragranceFamilySlugs", updatedFilters["Fragrance Family"]!);
    } else {
      params.delete("fragranceFamilySlugs");
    }
    if (updatedFilters["Mood"]) {
      params.set("moodSlugs", updatedFilters["Mood"]!);
    } else {
      params.delete("moodSlugs");
    }

    params.set("type", "prime");
    params.set("page", "1");
    params.set("limit", "10");

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleSubcategoryClick = (category: string, item: string) => {
    setSelectedFilters((prev) => {
      const newFilters = {
        ...prev,
        [category]: prev[category] === item ? null : item,
      };
      updateSearchParams(newFilters);
      return newFilters;
    });
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
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap justify-center gap-4 sm:space-x-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="text-center cursor-pointer"
            onClick={() => {
              setDrawerOpen(true);
              setSelectedCategory(cat.label);
            }}
          >
            <div className="w-20 h-16 sm:w-25 sm:h-20 rounded-md">
              <Image
                src={cat.imageUrl}
                alt="pic"
                width={120}
                height={150}
                className="object-cover rounded-md h-full"
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
          <Drawer.Overlay className="fixed inset-0 bg-black/30 z-40" />
          <Drawer.Content className="fixed top-0 right-0 w-full sm:w-[480px] h-full bg-white z-50 p-4 overflow-y-auto overflow-x-hidden">
            <div className="flex justify-end mb-3">
              <IoMdClose
                size={34}
                onClick={() => setDrawerOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <Drawer.Title className="text-lg font-semibold">
                PERSONALIZE
              </Drawer.Title>
              <button
                className="text-pink-500"
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
              >
                Reset all
              </button>
            </div>

            {Object.entries({
              "Scent Type": scentTypes,
              "Fragrance Family": fragranceFamilies,
              Mood: productMoods,
              Occasion: productOccasions,
            }).map(([section, items]) => (
              <div key={section} id={`${section}`} className="mb-4">
                <h3 className="text-sm font-bold text-gray-700 mb-2">
                  {section}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {items.map((item) => (
                    <div
                      key={item.slug}
                      onClick={() => handleSubcategoryClick(section, item.slug)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden cursor-pointer border transition-all duration-200 ${
                        selectedFilters[section] === item.slug
                          ? "border-pink-500"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={item.iconUrl || "/images/shop/occassion.jpg"}
                        alt={item.slug}
                        width={1000}
                        height={1000}
                        className={` object-cover h-full rounded-md ${
                          selectedFilters[section] === item.slug
                            ? "blur-sm"
                            : ""
                        } `}
                      />
                      <div className="absolute bottom-0 left-0 right-0 text-xs text-white bg-black bg-opacity-40 text-center py-1">
                        {item.slug
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char: any) => char.toUpperCase())}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
