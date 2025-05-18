"use client";

import { useToast } from "@/context/ToastContext";
import { ProductAttribute, profileMgtService } from "@/services/profilemgt";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preferences() {
  const { getProductAttributesMoods } = profileMgtService;
  const { error } = useToast();

  const [moodAttributes, setMoodAttributes] = useState<ProductAttribute[]>([]);

  const getMoodAttributes = async () => {
    try {
      const res = await getProductAttributesMoods();
      if (res !== null) {
        setMoodAttributes(res.data);
      }
    } catch (err) {
      console.log(err);
      error("Login failed. Please check your credentials.");
    }
  };
  useEffect(() => {
    getMoodAttributes();
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full lg:max-h-[80vh] lg:overflow-y-scroll bg-white rounded-xl p-3">
      <p className="text-xl lg:text-2xl text-black "> My Preferences</p>

      <div className="flex flex-col gap-4">
        <p className="font-semibold text-[#98A0B4]">Scent Type</p>
        <div className="flex flex-wrap items-center gap-3">
          {moodAttributes.map((vary, ind) => (
            <div className="flex flex-col gap-3 items-center " key={ind}>
              <div className="max-w-[150px] lg:max-w-[173px] h-[80px] rounded-lg bg-[#F2F4F7] overflow-hidden">
                <Image
                  src={
                    vary.iconUrl ||
                    "/images/category_selection/premium_center.png"
                  }
                  alt="pic"
                  width={1000}
                  height={1000}
                  objectFit="contain"
                  className="object-contain h-full"
                />
              </div>
              <p className="text-sm font-medium text-black text-center">
                {vary.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-[#98A0B4]">Occasion</p>
        <div className="flex flex-wrap items-center gap-3">
          {/* {item.variants.map((vary, ind) => (
              <div className="flex flex-col gap-3 items-center " key={ind}>
                <div className="max-w-[150px] lg:max-w-[173px] h-[80px] rounded-lg bg-[#F2F4F7] overflow-hidden">
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
            ))} */}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-[#98A0B4]">Frangrance Family</p>
        <div className="flex flex-wrap items-center gap-3">
          {/* {item.variants.map((vary, ind) => (
              <div className="flex flex-col gap-3 items-center " key={ind}>
                <div className="max-w-[150px] lg:max-w-[173px] h-[80px] rounded-lg bg-[#F2F4F7] overflow-hidden">
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
            ))} */}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-[#98A0B4]">Mood</p>
        <div className="flex flex-wrap items-center gap-3">
          {moodAttributes.map((vary, ind) => (
            <div className="flex flex-col gap-3 items-center " key={ind}>
              <div className="max-w-[150px] lg:max-w-[173px] h-[80px] rounded-lg bg-[#F2F4F7] overflow-hidden">
                <Image
                  src={
                    vary.iconUrl ||
                    "/images/category_selection/premium_center.png"
                  }
                  alt="pic"
                  width={1000}
                  height={1000}
                  objectFit="contain"
                  className="object-contain h-full"
                />
              </div>
              <p className="text-sm font-medium text-black text-center">
                {vary.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
