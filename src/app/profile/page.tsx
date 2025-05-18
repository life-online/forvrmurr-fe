"use client";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import AccountActions from "@/components/profile/AccountActions";
import ProfileMobileSideBar from "@/components/profile/MobileSideBar";
import OptionalAddons from "@/components/profile/OptionalAddons";
import Plan from "@/components/profile/Plan";
import Preferences from "@/components/profile/Preferences";
import UpcomingDeliveryCard from "@/components/profile/UpcomingDelivery";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RiMenu5Fill } from "react-icons/ri";
const dirs = [
  "My Upcoming Delivery",
  "My Preferences",
  "My Plan",
  "Account Actions",
  "Optional Add-on",
  "Profile",
];
export default function ProfilePage() {
  const [view, setView] = useState<string>(dirs[0]);
  const [hoveredDir, setHoveredDir] = useState<string>();
  const [isSideBar, setisSideBar] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const onCloseSideBar = () => setisSideBar(false);
  useEffect(() => {
    const q = params.get("view");
    if (q && q !== view) setView(q);
  }, [params, view]);
  const onClickMenu = (dir: string) => {
    setView(dir);
    // no options here, just push the new search param
    router.push(`${pathname}?view=${encodeURIComponent(dir)}`);
  };
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBar message="New collection revealed monthly!" />
      <Navbar />

      <div className="bg-[#f7ede1] p-5 md:p-8 lg:p-12 flex flex-col gap-5">
        <div className="lg:hidden flex items-center">
          <RiMenu5Fill
            className="text-[#8B0000]"
            onClick={() => setisSideBar(true)}
          />
          <ProfileMobileSideBar
            isOpen={isSideBar}
            onClose={onCloseSideBar}
            dirs={dirs}
            view={view}
            onClickView={onClickMenu}
            hoveredDir={hoveredDir}
            setHoveredDir={setHoveredDir}
          />
        </div>
        <div className="flex items-start justify-between gap-8">
          <div className="hidden lg:flex flex-col gap-5 w-[20%] ">
            <p className="text-xl lg:text-2xl text-black font-semibold">
              Hello,
            </p>
            <div className="flex flex-col gap-4">
              {dirs.map((item, index) => (
                <div
                  className="flex items-center gap-1  cursor-pointer"
                  key={index}
                  onClick={() => onClickMenu(item)}
                  onMouseEnter={() => setHoveredDir(item)}
                  onMouseLeave={() => setHoveredDir(undefined)}
                >
                  <div
                    className={`h-7 ${
                      view === item || hoveredDir === item
                        ? "opacity-100"
                        : "opacity-1"
                    } ease-in-out duration-500 border-2 rounded-full border-[#C8102E]`}
                  ></div>

                  <p
                    className={`px-3 w-full py-1 text-black hover:bg-white ease-in-out ${
                      view === item ? "bg-white" : ""
                    } duration-500 rounded-lg`}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full lg:w-[75%] bg-white rounded-xl p-3">
            {view === "My Upcoming Delivery" && <UpcomingDeliveryCard />}
            {view === "My Preferences" && <Preferences />}
            {view === "My Plan" && <Plan />}
            {view === "Account Actions" && <AccountActions />}
            {view === "Optional Add-on" && <OptionalAddons />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
