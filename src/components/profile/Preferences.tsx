"use client";

import { useToast } from "@/context/ToastContext";
import { ProductAttribute, profileMgtService } from "@/services/profilemgt";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preferences() {
  const {
    getProductAttributesMoods,
    getProductAttributesFragranceFamily,
    getProductAttributesFragranceNotes,
    getProductAttributesOccasion,
    getScentTypesAttributesMoods,
  } = profileMgtService;
  const { error } = useToast();

  const [moodAttributes, setMoodAttributes] = useState<ProductAttribute[]>([]);
  const [scentTypesAttributes, setscentTypesAttributes] = useState<
    ProductAttribute[]
  >([]);
  const [fragranceFamiliesAttributes, setfragranceFamiliesAttributes] =
    useState<ProductAttribute[]>([]);
  const [fragranceNotesAttributes, setfragranceNotesAttributes] = useState<
    ProductAttribute[]
  >([]);
  const [occasionAttributes, setoccasionAttributes] = useState<
    ProductAttribute[]
  >([]);

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
  const getFragranceNotesAttributes = async () => {
    try {
      const res = await getProductAttributesFragranceNotes();
      if (res !== null) {
        setfragranceNotesAttributes(res.data);
      }
    } catch (err) {
      console.log(err);
      error("Login failed. Please check your credentials.");
    }
  };
  const getScentTypesAttributes = async () => {
    try {
      const res = await getScentTypesAttributesMoods();
      if (res !== null) {
        setscentTypesAttributes(res.data);
      }
    } catch (err) {
      console.log(err);
      error("Login failed. Please check your credentials.");
    }
  };
  const getFragranceFamiliesAttributes = async () => {
    try {
      const res = await getProductAttributesFragranceFamily();
      if (res !== null) {
        setfragranceFamiliesAttributes(res.data);
      }
    } catch (err) {
      console.log(err);
      error("Login failed. Please check your credentials.");
    }
  };
  const getOccasionsAttributes = async () => {
    try {
      const res = await getProductAttributesOccasion();
      if (res !== null) {
        setoccasionAttributes(res.data);
      }
    } catch (err) {
      console.log(err);
      error("Login failed. Please check your credentials.");
    }
  };
  useEffect(() => {
    getMoodAttributes();
    getScentTypesAttributes();
    getFragranceFamiliesAttributes();
    getFragranceNotesAttributes();
    getOccasionsAttributes();
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full lg:max-h-[80vh] lg:overflow-y-scroll bg-white rounded-xl p-3">
      <p className="text-xl lg:text-2xl text-black "> My Preferences</p>

      <div className="flex flex-col gap-4">
        <p className="font-semibold text-[#98A0B4]">Scent Type</p>
        <div className="flex flex-wrap items-center gap-3">
          {scentTypesAttributes.map((vary, ind) => (
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
          {occasionAttributes.map((vary, ind) => (
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
        <p className="font-semibold text-[#98A0B4]">Frangrance Family</p>
        <div className="flex flex-wrap items-center gap-3">
          {fragranceFamiliesAttributes.map((vary, ind) => (
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
        <p className="font-semibold text-[#98A0B4]">Frangrance Notes</p>
        <div className="flex flex-wrap items-center gap-3">
          {fragranceNotesAttributes.map((vary, ind) => (
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
