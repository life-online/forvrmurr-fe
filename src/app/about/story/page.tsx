import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Obsession() {
  return (
    <div className="bg-black text-white min-h-screen w-full ">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] lg:h-screen py-5 w-full flex items-center justify-center bg-gradient-to-r from-[#320000] to-black  text-white py-20  px-4">
        <div className="absolute inset-0">
          <img
            src="/brand-background.svg"
            alt="Perfume background"
            className=" object-cover w-full h-full blur-sm opacity-30 "
          />
        </div>

        <div
          className="relative z-10 max-w-[80%] w-full h-[30vh] md:h-[50vh] lg:h-[80vh] bg-center bg-contain  bg-no-repeat p-8 rounded-xl flex flex-col items-center justify-center"
          style={{ backgroundImage: "url('/obsession.svg')" }}
        >
          {/* <h1 className="text-2xl md:text-3xl font-semibold mb-4">THIS STARTED WITH <span className="text-red-600 font-bold">OBSESSION</span></h1> */}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="flex justify-center">
        <div className="bg-black max-w-6xl mt-16 items-center text-center md:text-left flex flex-col-reverse lg:flex-row gap-10 items-center">
          <div className="w-full">
            <img
              src="/locations.png"
              alt="Perfume Bottle"
              // width={250}
              // height={250}
              className="mx-auto md:mx-0 h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-lg shadow-lg transition-all ease-in-out duration-500 hover:scale-105 md:w-[400px] lg:w-[500px] w-full max-w-md mx-auto md:mx-0"
            />
          </div>
          <div className="text-white mx-auto max-w-sm md:max-w-xl lg:w-full pe-6 ">
            <h2 className="text-3xl font-bold mb-4">OUR STORY</h2>
            <p className="mb-6 ">
              Niche fragrance was always a gateway—until we entered the dark.
              Every scent was born from a shared obsession to make fragrance
              more than we knew. Margins lived in shadows where character
              thrived; we followed the fog, the figment. We create from longing,
              stretch scent, hold abstraction as an art.
              <br />
              <br />
              Transparency is intimate. Personal. It should feel like a love
              story, not a showroom click.
            </p>
            <button className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 text-sm rounded-lg">
              Explore Our Scents
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
