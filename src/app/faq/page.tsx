import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";

export default function Faq() {
  return (
    <div className="min-h-screen bg-white flex flex-col gap-5">
      <AnnouncementBar message="New collection revealed monthly!" />
      <Navbar />
      <div className="h-[30vh]">
        <Image
          src={"/images/category_selection/faqBanner.png"}
          alt="banner"
          className="w-full h-full"
          width={1000}
          height={1000}
        />
      </div>
      <div className="flex flex-col gap-2">p.text-xl.</div>
    </div>
  );
}
