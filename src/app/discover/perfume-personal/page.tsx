import React from "react";

export default function PerfumeQuizLanding() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-black bg-opacity-70 text-center px-4">
      <div className="absolute inset-0">
        <img
          src="/brand-background.svg"
          alt="Perfume background"
          className="object-cover w-full h-full blur-sm opacity-30 "
        />
      </div>

      <div className="relative z-10 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-semibold text-[#E9B873] leading-snug cinzel-font">
          PERFUME IS PERSONAL.
          <br />
          LET’S GET YOURS RIGHT
        </h1>
        <p className="text-[#E9B873] leading-[23px] mt-6 text-2xl libre-baskerville-regular">
          Let your preferences guide your perfume journey. Take our quiz to uncover which mood, vibe, and fragrance tier (Prime or Premium) best suits you.
        </p>
        <button className="mt-6 bg-[#8B0000] hover:bg-[#8e1413] text-white py-3 px-8 rounded-[12px] text-sm font-medium transition duration-300">
          Start the Quiz
        </button>
      </div>
    </div>
  );
}
