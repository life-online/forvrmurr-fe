import Navbar from "@/components/layout/Navbar";

export default function TwoWomen() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="">
        <div>
          <img
            src="/two_women.svg"
            alt="Model with fragrance"
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white text-black py-16 px-6 text-center">
        <p className="max-w-2xl mx-auto text-lg">
          Forvr Murr began with late-night voice notes about scents that made us
          feel something. We’re two women from Lagos, Nigeria with a shared
          belief: fragrance should never be inaccessible, boring, or
          intimidating.
        </p>
      </section>

      {/* Founders Section */}
      <section className="bg-white text-black pt-3 pb-20 px-6 text-center">
        <h3 className="text-red-700 uppercase text-sm tracking-widest mb-2">
          Meet the Team
        </h3>
        <h2 className="text-3xl font-bold mb-10">Our Founders</h2>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <div className=" p-6 rounded-lg">
            <div className="w-full h-80 bg-gray-300 rounded mb-4"></div>
            <h4 className="text-red-700 font-bold mb-2">Ayodeji</h4>
            <p className="text-sm">
              Ayodeji is known for her friend-first work for Forvr. Her
              communication ethos shapes Murr’s every move. Passionate about art
              and perfume as a method of archiving, she pulls references from a
              catalog of cinema, opera, and oral tradition. A trained writer,
              Ayodeji has told scent stories for Google, Armani, and more. She
              self-published a tiny perfume glossary with the fictional Queen of
              the Night by The Merchant of Venice.
            </p>
          </div>

          <div className=" p-6 rounded-lg">
            <div className="w-full h-80 bg-gray-300 rounded mb-4"></div>
            <h4 className="text-red-700 font-bold mb-2">Lamide</h4>
            <p className="text-sm">
              Lamide is an emotional scholar and scent researcher. Her scent lab
              is the gap between self-recognition and risk. She’s spoken at
              Harvard and written scent reviews that read like tiny memoirs. Her
              nose is guided by abstraction, intuition, and the quiet. She
              describes her scent development process for Forvr as: fragrance
              like it’s a spiritual gift.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
