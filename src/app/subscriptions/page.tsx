'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Plans data is defined within the component
/*
const plans = [
  {
    name: 'Prime Subscription',
    price: '₦17,500',
    button: 'Subscribe to Prime – ₦17,500/mo',
    type: 'Accessible niche + designer',
    travelCase: 'Yes (first month)',
    greatFor: 'Everyday luxury',
    perk: "-",
  },
  {
    name: 'Premium Subscription',
    price: '₦55,000',
    button: 'Subscribe to Premium – ₦55,000/mo',
    type: 'Rare niche & ultra-luxury',
    travelCase: 'Yes (first month)',
    greatFor: 'Bold, signature scents',
    perk: 'Early access to new scents & exclusive drops',
  },
];
*/

const faqs = [
  {
    q: 'Can I choose the scent I receive each month?',
    a: 'While your monthly scent is curated based on your quiz results, were building something new! Before your next shipment, youll be able to see your wishlist and self-prioritize slots in your upcoming deliveries. Coming soon to your subscription dashboard!'
  },
  {
    q: 'Whats the difference between Prime and Premium?',
    a: 'Prime is accessible niche + designer, Premium is rare niche & ultra-luxury.'
  },
  {
    q: 'Can I skip a month or cancel my subscription?',
    a: 'Yes, you can skip or cancel anytime from your dashboard.'
  },
  {
    q: 'When will I receive my first delivery?',
    a: 'Your first delivery will arrive within 5-7 business days after subscribing.'
  },
  {
    q: 'Can I gift a subscription?',
    a: 'Yes, you can gift a subscription to someone special!'
  },
];

export default function SubscriptionsPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/subscriptions/manage');
  }, [router]);
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  return (
    <>
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center justify-center py-10 bg-black">
        <div className="bg-[#2d0000] rounded-3xl max-w-3xl w-full mx-auto flex flex-col items-center p-0 md:p-0 relative overflow-hidden" style={{boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)'}}>
          <div className="w-full h-[400px] md:h-[480px] relative flex items-center justify-center">
            <Image src="/images/subscriptions/hero.png" alt="Hero" fill priority className="object-cover w-full h-full" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8 md:py-12">
            <h1 className="text-2xl md:text-3xl font-serif text-[#e6c789] mb-4 text-center drop-shadow-lg">YOUR NEXT OBSESSION, DELIVERED MONTHLY</h1>
            <p className="text-[#e6c789] text-base md:text-lg mb-6 text-center drop-shadow-lg max-w-2xl">Every month, we send a fragrant reminder that you deserve softness, depth, and discovery. Choose your pace—Prime or Premium—and let your next scent obsession find you.<br/>Your first delivery includes a free travel case, because luxury should arrive dressed for the part.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-center my-10">
          <button className="bg-[#a0001e] text-white px-6 py-2 rounded">Subscribe to Prime – ₦17,500/mo</button>
          <button className="border border-white text-white px-6 py-2 rounded">Subscribe to Premium – ₦55,000/mo</button>
        </div>
      </div>
      {/* Compare Plans */}
      <div className="max-w-6xl mx-auto w-full py-16 px-2">
        <h2 className="text-center text-2xl font-serif mb-8 text-[#a0001e]">COMPARE PLANS</h2>
        <div className="bg-white border border-gray-100 rounded-lg p-0 overflow-x-auto text-black">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-1/4 p-6"></th>
                <th className="w-1/4 p-6 text-center text-xl font-serif font-semibold border-l border-gray-200">Prime Subscription</th>
                <th className="w-1/4 p-6 text-center text-xl font-serif font-semibold border-l border-gray-200">Premium Subscription</th>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-6 text-lg font-serif">Compare plans</td>
                <td className="p-6 text-center align-top border-l border-gray-200">
                  <div className="text-4xl font-bold mb-1">₦17,500<span className="text-base font-normal">/Month</span></div>
                  <button className="bg-[#a0001e] text-white px-6 py-3 rounded-lg mt-4 w-full max-w-xs mx-auto">Subscribe to Prime – ₦17,500/mo</button>
                </td>
                <td className="p-6 text-center align-top border-l border-gray-200">
                  <div className="text-4xl font-bold mb-1">₦55,000<span className="text-base font-normal">/Month</span></div>
                  <button className="bg-[#a0001e] text-white px-6 py-3 rounded-lg mt-4 w-full max-w-xs mx-auto">Subscribe to Premium – ₦55,000/mo</button>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-6 px-4 font-serif text-lg flex items-center">🔥<span className="ml-2">Type of Scents</span></td>
                <td className="py-6 px-4 text-center text-lg border-l border-gray-200">Accessible niche + designer</td>
                <td className="py-6 px-4 text-center text-lg border-l border-gray-200">Rare niche & ultra-luxury</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-6 px-4 font-serif text-lg">Free Travel Case</td>
                <td className="py-6 px-4 text-center text-lg border-l border-gray-200">Yes (First month)</td>
                <td className="py-6 px-4 text-center text-lg border-l border-gray-200">Yes (First month)</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-6 px-4 font-serif text-lg">Great For</td>
                <td className="py-6 px-4 text-center text-lg border-l border-gray-200">Everyday luxury</td>
                <td className="py-6 px-4 text-center text-lg border-l border-gray-200">Bold, signature scents</td>
              </tr>
              <tr>
                <td className="py-6 px-4 font-serif text-lg">Exclusive Perk</td>
                <td className="py-6 px-4 text-center text-lg border-l border-gray-200">-</td>
                <td className="py-6 px-4 text-center text-lg border-l border-gray-200">Early access to new scents & exclusive drops</td>
              </tr>
            </tbody>
          </table>
          <div className="text-center mt-10 mb-6">
            <div className="text-lg font-serif mb-4">Not sure which subscription fits your fragrance style? Let your mood guide you</div>
            <button className="border border-[#a0001e] text-[#a0001e] px-8 py-3 rounded-lg font-serif text-lg hover:bg-[#a0001e] hover:text-white transition-colors">Take the Scent Quiz</button>
          </div>
        </div>
        {/* Image under table */}
        <div className="flex justify-center my-12">
          <div className="rounded-2xl overflow-hidden shadow-lg max-w-4xl w-full">
            <img src="/images/subscriptions/image.png" alt="Subscription Visual" className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>
      {/* How it Works Section */}
      <div className="max-w-6xl mx-auto w-full my-12">
        <div className="bg-[#f7ede1] rounded-xl p-8 md:p-12 flex flex-col items-center">
          <h2 className="text-center text-[#a0001e] text-xl md:text-2xl font-serif mb-8 tracking-widest font-semibold">HOW IT WORKS SECTION</h2>
          <div className="w-full flex flex-col md:flex-row justify-between items-stretch gap-8">
            <div className="flex-1 flex flex-col items-center text-center px-4">
              <div className="text-2xl md:text-3xl font-serif text-[#a0001e] mb-2 font-semibold">1</div>
              <div className="text-lg md:text-xl font-serif font-bold mb-2 text-[#a0001e]">Tell Us What You Love</div>
              <div className="text-gray-700 text-base">Take our scent quiz and share your preferences.</div>
            </div>
            <div className="flex-1 flex flex-col items-center text-center px-4">
              <div className="text-2xl md:text-3xl font-serif text-[#a0001e] mb-2 font-semibold">2</div>
              <div className="text-lg md:text-xl font-serif font-bold mb-2 text-[#a0001e]">We Curate, You Discover</div>
              <div className="text-gray-700 text-base">Based on your quiz, we select a scent each month just for you.</div>
            </div>
            <div className="flex-1 flex flex-col items-center text-center px-4">
              <div className="text-2xl md:text-3xl font-serif text-[#a0001e] mb-2 font-semibold">3</div>
              <div className="text-lg md:text-xl font-serif font-bold mb-2 text-[#a0001e]">Delivered with Love</div>
              <div className="text-gray-700 text-base">Your final fragrance arrives in luxe packaging—ready to spritz, layer, and obsess over.</div>
            </div>
          </div>
        </div>
      </div>
      {/* Not Sure Where to Start Section */}
      <div className="max-w-4xl mx-auto w-full text-center my-16">
        <h3 className="text-xl md:text-2xl font-serif text-[#a0001e] mb-2 tracking-widest font-semibold uppercase">Not Sure Where to Start?</h3>
        <div className="text-2xl md:text-3xl font-serif text-black mb-6">Our scent quiz helps match you with your perfect Forvr Murr fragrance tier and monthly picks.</div>
        <button className="border border-[#a0001e] text-[#a0001e] px-8 py-2 rounded-lg font-serif text-lg hover:bg-[#a0001e] hover:text-white transition-colors">Take the Quiz</button>
      </div>
      {/* Subscription FAQ Section */}
      <div className="w-full bg-[#f7ede1] py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 px-4">
          {/* Left: FAQ heading and help */}
          <div className="flex-1 flex flex-col justify-start">
            <h4 className="text-lg font-serif mb-2 uppercase tracking-widest">SUBSCRIPTION FAQS</h4>
            <div className="text-gray-700 mb-2">Still have questions? We&apos;ve answered them here!</div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-2 mb-2 w-full max-w-md border border-gray-200">
              <input type="checkbox" className="accent-[#a0001e]" />
              <span>Still need help?</span>
            </div>
            <div className="text-sm text-gray-500">Visit our contact page for more details <a href="/contact" className="underline">Contact Us</a></div>
          </div>
          {/* Right: Accordion */}
          <div className="flex-1">
            <h4 className="text-lg font-serif mb-2 text-[#a0001e] uppercase tracking-widest">STILL HAVE QUESTIONS? WE&apos;VE ANSWERED THEM HERE</h4>
            <div className="rounded-xl p-0">
              {faqs.map((faq, idx) => (
                <div key={faq.q} className="mb-2 border border-gray-200 rounded overflow-hidden bg-white">
                  <button className="w-full text-left font-serif font-semibold text-[#a0001e] px-4 py-3 focus:outline-none flex justify-between items-center" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                    <span>{faq.q}</span>
                    <span className="ml-2">{openFaq === idx ? '-' : '+'}</span>
                  </button>
                  {openFaq === idx && <div className="text-gray-700 mt-0 px-4 pb-3 text-sm">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* FAQ Section */}
    </>
  );
}