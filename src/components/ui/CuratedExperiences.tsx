export default function CuratedExperiences({
  showButton,
}: {
  showButton?: boolean;
}) {
  return (
    <div className="curatedBg overflow-hidden h-screen ">
      {/* <div className="curatedBg"></div> */}
      <div className="flex z-50 items-center h-full p-5 md:p-8 lg:p-12 md:text-left text-center">
        <div className="flex flex-col gap-5 md:gap-8 ">
          <h2 className="text-xl md:text-2xl text-[#E9B87380] font-thin md:text-3xl font-serif">
            OVER 200 CURATED FRAGRANCES.
            <br />
            ONE SIGNATURE EXPERIENCE.
          </h2>
          <p className="text-neutral-400 max-w-2xl md:text-xl mx-auto">
            The luxury perfume world was built on exclusivity. We’re here to
            break that barrier—without watering anything down. We stock{" "}
            <strong className="text-neutral-300">
              over 200 of the best designer and niche fragrances in the world.
            </strong>{" "}
            From Parfums de Marly to Lattafa, Amouage to Armaf.
          </p>
          <p className="text-neutral-400 max-w-2xl md:text-xl mx-auto">
            While most decants arrive in plain plastic vials, ours are a
            <strong className="text-neutral-300">
              luxury experience—with premium packaging
            </strong>
            , mood-based bundles, and unforgettable scent storytelling.
          </p>
          <p className="text-neutral-400 max-w-2xl md:text-xl mx-auto">
            Forvr Murr is more than a perfume shop. It&apos;s a curated world of
            scent, desire, and indulgence.
          </p>
          {showButton && (
            <button className="bg-[#8b0000] text-nowrap w-fit text-white py-3 px-6 text-xs rounded-xl transition-all hover:bg-[#6b0000] font-medium">
              Subscribe
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
