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

      <div className="relative z-10 max-w-3xl text-center">
        <p className="text-[#E9B873] mb-6 text-2xl libre-baskerville-regular">You&apos;re in your Prime</p>
        <h1 className="text-4xl font-semibold text-[#E9B873] leading-snug cinzel-font">
          YOUR SCENT ENERGY IS SOFT GLOW’
        </h1>
        <p className="text-[#E9B873] leading-[23px] mt-6 text-2xl libre-baskerville-regular px-5">
          You love soft blends, creamy gourmands, and scents that whisper luxury.
          Prime gives you access to elevated designer and niche picks—from Lattafa
          Khamrah to Maison Margiela’s By the Fireplace—without the full bottle pressure.
        </p>

        <div className="bg-white rounded-md py-2 px-6 mx-auto max-w-2xl my-8">
          <p className="text-[#8B0000] font-bold mb-2 cinzel">WHAT’S NEXT?</p>
          <p className="text-[#C8102E] text-lg libre-baskerville-regular leading-[20px]">
            You’ll receive an 8ml perfume every month based on your quiz. Your first delivery
            comes with a free travel case, luxe packaging, and your next signature scent.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-[#8B0000] hover:bg-[#8e1413] text-white py-3 px-6 rounded-lg text-sm font-medium transition duration-300">
            Subscribe to Prime – ₦17,000/mo
          </button>
          <button className="border border-white text-white py-3 px-6 rounded-lg text-sm font-medium transition duration-300">
            Subscribe to Premium – ₦25,000/mo
          </button>
        </div>
      </div>
    </div>
  );
}
