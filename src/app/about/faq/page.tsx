"use client";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import generalFaq from "@/data/generalFaq.json";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-white flex flex-col ">
      <AnnouncementBar message="New collection revealed monthly!" />
      <Navbar />
      <div className="h-[30vh] md:h-[50%] w-full lg:h-[60vh]">
        <Image
          src={"/images/category_selection/faqBanner.png"}
          alt="banner"
          className="w-full object-cover h-full"
          width={1000}
          height={1000}
        />
      </div>
      <div className="flex flex-col items-center gap-5 p-5">
        <div className="flex flex-col lg:w-[30%] md:w-[50%] w-[80%] gap-2">
          <p className="text-xl lg:text-2xl text-center text-[#8B0000]">FAQS</p>
          <p className="text-xl leading-12 md:text-2xl text-center w-full  lg:text-3xl text-black">
            Explore our FAQ section for all your burning questions answered.
          </p>
        </div>
        <div className="flex w-full items-center justify-center">
          <p className="text-sm text-[#C8102E]">Showing 26 questions</p>
        </div>
        <div className="flex flex-col items-center gap-3 w-[90%] lg:w-[50%]">
          {generalFaq.map((item, index) => (
            <div
              className="flex flex-col items-center gap-3 w-full"
              key={index}
            >
              <p className="text-xl lg:text-2xl text-[#CE0000]">{item.name}</p>
              <div className="flex flex-col gap-2 w-full">
                {item.questions.map((faq) => (
                  <div
                    key={faq.id}
                    className="mb-2 border border-gray-200 rounded overflow-hidden bg-white"
                  >
                    <button
                      className="w-full text-left font-serif font-semibold text-[#1C1C1C] px-4 py-3 focus:outline-none flex justify-between items-center"
                      onClick={() =>
                        setOpenFaq(openFaq === faq.id ? null : faq.id)
                      }
                    >
                      <span>{faq.q}</span>
                      <span className="ml-2">
                        {openFaq === faq.id ? "-" : "+"}
                      </span>
                    </button>
                    {openFaq === faq.id && (
                      <div className="text-[#1C1C1C] mt-0 px-4 pb-3 text-sm">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className="text-sm text-black">
            still need help?{" "}
            <span className="underline text-[#C8102E]"><Link href="/contact">Contact Us here</Link></span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
