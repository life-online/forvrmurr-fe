/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { MockAddons } from "@/data/preference";
import { profileMgtService } from "@/services/profilemgt";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function OptionalAddons() {


  const [products, setProducts] = useState<any>();

  async function fetchProducts() {
    const fetchedProducts = await profileMgtService.getAllProduct('Luxury Perfume Travel Case');
    setProducts(fetchedProducts?.data);
  }
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="flex flex-col gap-5 w-full lg:max-h-[80vh] lg:overflow-y-scroll bg-white rounded-xl p-3">
      <p className="text-xl lg:text-2xl text-black ">
        Want to add something extra to next month’s delivery?
      </p>

      <p className="text-[#343339]">Optional Add-On</p>
      {products?.map((addon:any, index:number) => (
        <div
          className="flex md:flex-row  w-full gap-3 items-center justify-between"
          key={index}
        >
          <div className="flex items-center w-full gap-2">
            <div className="w-[80px] h-[80px] rounded-lg bg-[#F2F4F7] overflow-hidden">
              <Image
                src={addon.img}
                alt="pic"
                width={1000}
                height={1000}
                objectFit="contain"
                className="object-contain h-full"
              />
            </div>
            <div className="">
              <p className="text-sm text-[#343339]">{addon.name}</p>
              <p className="text-sm text-[#8B0000]">{addon.nairaPrice}</p>
            </div>
          </div>
          <button className="px-5 py-2 md:min-w-[202px] font-medium rounded-xl cursor-pointer hover:bg-[#8B0000] hover:text-white ease-in-out duration-500 border border-[#8B000060] text-[#8B0000] ">
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
