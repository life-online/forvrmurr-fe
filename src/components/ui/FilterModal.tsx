import React, { useState } from "react";

const filterOptions = {
  "Scent Type": ["Warm", "Strong", "Sweet", "Fresh", "Clean", "Powdery"],
  Occasion: ["Date Night", "Daytime", "Office", "Vacation", "Workout", "Party"],
  "Fragrance Family": [
    "Woody",
    "Spicy",
    "Citrusy",
    "Floral",
    "Fruity",
    "Aquatic",
    "Oriental",
    "Fresh",
    "Gourmand",
  ],
  Mood: [
    "Soft & Serene",
    "Clean Addictive",
    "Bold Moves",
    "After Dark",
    "Warm Glow",
    "Main Character",
    "Vacation Mood",
  ],
};

const FilterModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [selected, setSelected] = useState<{ [section: string]: string[] }>({});

  if (!open) return null;

  const handleSelect = (section: string, value: string) => {
    setSelected((prev) => {
      const already = prev[section]?.includes(value);
      return {
        ...prev,
        [section]: already
          ? prev[section].filter((v) => v !== value)
          : [...(prev[section] || []), value],
      };
    });
  };

  const handleReset = () => setSelected({});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 w-full max-w-md relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold">Personalize</h2>
          <button
            className="text-[#a0001e] text-base font-serif hover:underline"
            onClick={handleReset}
          >
            Reset all
          </button>
        </div>
        {/* Sections */}
        {Object.entries(filterOptions).map(([section, options]) => (
          <div key={section} className="mb-6">
            <h3 className="text-lg font-serif text-[#a0a3b1] mb-3 font-semibold">
              {section}
            </h3>
            <div className="flex flex-wrap gap-4">
              {options.map((option) => (
                <button
                  key={option}
                  className={`flex flex-col items-center w-24 h-20 rounded-xl bg-gray-100 justify-center transition-all border-2 ${
                    selected[section]?.includes(option)
                      ? "border-[#a0001e] bg-[#faf0e2]"
                      : "border-transparent"
                  }`}
                  onClick={() => handleSelect(section, option)}
                  type="button"
                >
                  <span className="mb-1 text-base">Pic</span>
                  <span className="text-sm font-serif text-gray-700 mt-1">
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterModal;
