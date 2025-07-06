"use client";

import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  // No props needed
}

const SplashScreen: React.FC<SplashScreenProps> = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start progress animation immediately
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Add small delay at 100% before hiding
          setTimeout(() => setIsVisible(false), 300);
          return 100;
        }
        return prev + 1;
      });
    }, 25); // ~2.5 seconds total for progress bar
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-[#faf5eb] transition-opacity duration-500">
      <div className="mb-12 flex flex-col items-center">
        <img 
          src="/images/logo.png" 
          alt="ForvrMurr" 
          className="h-20 md:h-24 w-auto" 
        />
        <h2 className="mt-4 font-serif text-lg md:text-xl text-[#8b0000] font-medium tracking-wider">
          LUXURY PERFUME SAMPLES
        </h2>
      </div>
      
      <div className="w-64 md:w-96 h-1 bg-gray-200/50 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-[#8b0000] transition-all duration-300 ease-out shadow-md"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 font-light cinzel-font tracking-wider">
        {progress < 100 ? "LOADING YOUR EXPERIENCE" : "WELCOME"}
      </p>
    </div>
  );
};

export default SplashScreen;
