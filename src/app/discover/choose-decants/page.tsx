import Footer from "@/components/layout/Footer";
import Link from "next/link";
import React from "react";

export default function PerfumeQuizLanding() {
  return (
    <div className="w-full text-center">
      {/* Hero Section */}
      {/* <Navbar /> */}
      <section className="relative h-[40vh] md:h-[60vh] lg:h-screen w-full flex items-center justify-center bg-black text-white px-4">
        <div className="absolute inset-0">
          <img
            src="/brand-background.svg"
            alt="Perfume background"
            className="object-cover w-full h-full blur-sm opacity-30 "
          />
        </div>

        <div
          className="relative z-10 max-w-3xl h-[75%] bg-center bg-cover bg-no-repeat p-8 rounded-xl flex flex-col items-center justify-center"
          style={{ backgroundImage: "url('/centered-bg.svg')" }}
        >
          <h1 className="text-sm md:text-2xl lg:text-3xl font-semibold text-[#F8D49A] mb-4 text-center">
            BLIND BUYING PERFUME IS <br /> UNSERIOUS
          </h1>
          <p className="text-[#F8D49A] text-xs md:text-lg mb-6 text-center">
            Whether it&apos;s a signature scent or a fleeting flirt, you deserve
            options — without the pressure of a $300 commitment.
          </p>
          {/* <button className="bg-[#8B0000] text-white py-3 px-6 rounded-md text-sm font-medium transition duration-300">
            Explore Gifting Options
          </button> */}
        </div>
      </section>

      {/* Why Choose Decants Section */}
      <section className="bg-white py-16 px-6 text-black">
        <div className=" mx-auto mb-10">
          <h2 className="text-[#A71916] text-xl md:text-2xl text-sm font-bold uppercase mb-4 cinzel">
            Why Choose Decants?
          </h2>
          <p className=" text-lg font-light max-w-3xl mx-auto">
            The niche perfume world was built on exclusivity. We break that
            barrier—without watering anything down. Our decants offer a
            luxurious way to sample the best perfumes on the market, without the
            risk of regret. Whether you’re exploring scent layering, building
            your wardrobe, or searching for THE ONE—this is the smarter, sexier
            way to shop.
          </p>
        </div>
        <img src="/section-img.svg" alt="Perfume bottle" className="mx-auto" />
        {/* <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
          <img
            src="/path-to-bottle-image.jpg"
            alt="Perfume bottle"
            className="w-48 md:w-64"
          />
          <div className="flex-1 bg-[#FFF3F1] p-6 rounded-lg text-left text-sm">
            <ul className="space-y-2">
              <li><strong>Full Bottles</strong>: High risk, high price — designer or niche $120+ per bottle, often blind bought.</li>
              <li><strong>Try 3-5 Scents Monthly</strong>: Get up to 5 decants for less than the price of one bottle.</li>
              <li><strong>Curated Signature, Without Waste</strong>: No regrets, just options.</li>
              <li><strong>Premium Packaging</strong>: Delivered in a travel-size atomizer in luxe packaging.</li>
              <li><strong>Perfect for Layering</strong>: Mix and match to create something uniquely yours.</li>
            </ul>
          </div>
        </div> */}

        <div className="mt-10">
          <Link href={"/shop"} className="inline-block">
            <button className="bg-[#A71916] hover:bg-[#8e1413] text-white py-3 px-8 rounded-md text-sm font-medium transition duration-300">
              Shop All Scents
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
