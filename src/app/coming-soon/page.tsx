import Link from 'next/link';

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <main className="text-center">
        <h1 
          className="text-6xl md:text-8xl font-bold mb-6 text-[#e6c789]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Coming Soon
        </h1>
        <p 
          className="text-xl md:text-2xl mb-10 text-gray-300"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          We're working hard to bring you something amazing. Stay tuned!
        </p>
        <Link href="/" legacyBehavior>
          <a 
            className="px-8 py-3 bg-[#e6c789] text-black font-semibold rounded-lg hover:bg-opacity-80 transition-colors duration-300 text-lg"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Go to Homepage
          </a>
        </Link>
      </main>
    </div>
  );
};

export default ComingSoonPage;
