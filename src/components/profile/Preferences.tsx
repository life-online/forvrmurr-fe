"use client";

import { MockPrefence } from "@/data/preference";
import Image from "next/image";

export default function Preferences() {
  return (
    <div className="flex flex-col gap-5 w-full lg:max-h-[80vh] lg:overflow-y-scroll bg-white rounded-xl p-3">
      <p className="text-xl lg:text-2xl text-black "> My Upcoming Delivery</p>

      {MockPrefence.map((item, index) => (
        <div className="flex flex-col gap-4" key={index}>
          <p className="font-semibold text-[#98A0B4]">{item.name}</p>
          <div className="flex flex-wrap items-center gap-3">
            {item.variants.map((vary, ind) => (
              <div className="flex flex-col gap-3 items-center " key={ind}>
                <div className="max-w-[173px] h-[80px] rounded-lg bg-[#F2F4F7] overflow-hidden">
                  <Image
                    src={vary.img}
                    alt="pic"
                    width={1000}
                    height={1000}
                    objectFit="contain"
                    className="object-contain h-full"
                  />
                </div>
                <p className="text-sm font-medium text-black text-center">
                  {vary.variantName}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
