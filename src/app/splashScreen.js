"use client";

import { useEffect, useState, createContext, useContext } from "react";

// Context to track splash screen completion
const SplashContext = createContext({ isComplete: false });

export const useSplashComplete = () => useContext(SplashContext);

// This simplified approach forces the splash screen to show for exactly 4.5 seconds
// on initial page load/refresh but not during client-side navigation
export default function SplashScreenWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // This code only runs in the browser
    let progressTimer, welcomeTimer, fadeOutTimer;

    // Start the progress animation - completes in ~3 seconds (100 * 30ms)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          
          // When progress reaches 100, show welcome text
          setShowWelcome(true);
          
          // Wait 1.5 seconds with "Welcome" showing before starting fade out
          fadeOutTimer = setTimeout(() => {
            // Start fade out animation
            setFadeOut(true);
            
            // Make content visible but fully transparent so it can start fading in
            setContentVisible(true);
            
            // Remove splash screen component after fade animation completes
            setTimeout(() => {
              setLoading(false);
              setIsComplete(true); // Mark splash as complete
            }, 700); // Increased from 500ms to 700ms for a smoother transition
          }, 1500);
          
          return 100;
        }
        return newProgress;
      });
    }, 30); // ~3000ms total for 100 steps

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeOutTimer);
    };
  }, []);

  // Render main content with splash screen overlay if needed
  return (
    <SplashContext.Provider value={{ isComplete }}>
      {loading && (
        <div 
          className={`fixed inset-0 flex flex-col items-center justify-center z-50 bg-[#faf5eb] transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="mb-8 flex flex-col items-center">
            <img 
              src="/logo.png" 
              alt="ForvrMurr" 
              className="h-10 md:h-12 w-auto" 
            />
          </div>
          
          <div className="w-64 md:w-96 h-1 bg-gray-200/50 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-[#8b0000] transition-all duration-300 ease-out shadow-md"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Simple text transition that will definitely be visible */}
          <div className="h-6 flex justify-center items-center">
            {!showWelcome && (
              <p className="text-sm text-gray-500">
                This isn't just perfume. It's a lifestyle.
              </p>
            )}
            
            {showWelcome && (
              <p className="text-sm text-gray-500">
                Welcome
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main content with fade-in effect */}
      <div 
        className={`transition-opacity duration-700 ease-in-out ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ visibility: contentVisible || !loading ? 'visible' : 'hidden' }}
      >
        {children}
      </div>
    </SplashContext.Provider>
  );
}
