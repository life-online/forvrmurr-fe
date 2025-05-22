export default function Obsession() {
    return (
        <div className="bg-black text-white min-h-screen w-full text-center">
            {/* Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#320000] to-black  text-white py-20  px-4">
                <div className="absolute inset-0">
                    <img
                        src="/brand-background.svg"
                        alt="Perfume background"
                        className="object-cover w-full h-full blur-sm opacity-30 "
                    />
                </div>

                <div
                    className="relative z-10 max-w-4xl w-full h-[80vh] bg-center bg-cover bg-no-repeat p-8 rounded-xl flex flex-col items-center justify-center"
                    style={{ backgroundImage: "url('/obsession.svg')" }}
                >
                    {/* <h1 className="text-2xl md:text-3xl font-semibold mb-4">THIS STARTED WITH <span className="text-red-600 font-bold">OBSESSION</span></h1> */}
                </div>
            </section>

            {/* Our Story Section */}
            <section className="flex justify-center">

                <div className="bg-black max-w-6xl mt-16  text-center md:text-left grid md:grid-cols-2 gap-10 items-center border border-[#393932]">
                    <div>
                        <img
                            src="/locations.svg"
                            alt="Perfume Bottle"
                            // width={250}
                            // height={250}
                            className="mx-auto md:mx-0"
                        />
                    </div>
                    <div className="text-white pe-6">
                        <h2 className="text-3xl font-bold mb-4">OUR STORY</h2>
                        <p className="mb-6 ">
                            Niche fragrance was always a gateway—until we entered the dark. Every scent was born from a shared obsession to make fragrance more than we knew. Margins lived in shadows where character thrived; we followed the fog, the figment. We create from longing, stretch scent, hold abstraction as an art.
                            <br /><br />
                            Transparency is intimate. Personal. It should feel like a love story, not a showroom click.
                        </p>
                        <button className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 text-sm rounded-lg">Explore Our Scents</button>
                    </div>
                </div>
            </section>
        </div>
    );
}