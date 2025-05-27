"use client";
import Image from "next/image";

export default function CuratedExperiences({
  showButton,
}: {
  showButton?: boolean;
}) {
  return (
    <div className="relative bg-gradient-to-r from-[#290101] to-[#8B0000] overflow-hidden">
      {/* Background Image */}
      <div className="absolute bottom-0 right-0 transition-all ease-in-out duration-500 w-[30vh] h-[30vh] md:w-[70vh] md:h-[70vh] lg:w-[90vh] lg:h-[90vh] z-0">
        <Image
          src={"/images/hero/lade.png"}
          alt="lade image"
          width={1112}
          height={957}
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-8 md:px-12 flex items-center py-24 my-16">
        <div className="flex flex-col gap-5 md:gap-8 text-center md:text-left">
          <h2 className="text-xl md:text-2xl lg:text-3xl text-[#E9B873] font-semibold font-serif">
            OVER 200 CURATED FRAGRANCES.
            <br />
            ONE SIGNATURE EXPERIENCE.
          </h2>
          <p className="text-neutral-200 md:text-xl max-w-2xl md:mx-0">
            The luxury perfume world was built on exclusivity. We're here to
            break that barrier—without watering anything down. We stock{" "}
            <strong className="text-neutral-100">
              over 200 of the best designer and niche fragrances in the world.
            </strong>{" "}
            From Parfums de Marly to Lattafa, Amouage to Armaf.
          </p>
          <p className="text-neutral-200 md:text-xl max-w-2xl md:mx-0">
            While most decants arrive in plain plastic vials, ours are a{" "}
            <strong className="text-neutral-100">
              luxury experience—with premium packaging
            </strong>
            , mood-based bundles, and unforgettable scent storytelling.
          </p>
          <p className="text-neutral-200 md:text-xl max-w-2xl md:mx-0">
            Forvr Murr is more than a perfume shop. It&apos;s a curated world of
            scent, desire, and indulgence.
          </p>
          {/* {showButton && (
            <div className="flex justify-center md:justify-start">
              <button className="bg-[#8b0000] text-white py-3 px-6 text-xs rounded-xl transition-all hover:bg-[#6b0000] font-medium">
                Subscribe
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
