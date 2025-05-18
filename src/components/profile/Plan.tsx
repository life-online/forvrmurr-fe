export default function Plan() {
  return (
    <div className="flex flex-col gap-5 w-full  bg-white rounded-xl p-3">
      <div className="flex flex-col md:flex-row gap-3 items-center w-full justify-between">
        <div className="flex items-center md:items-start flex-col gap-1">
          <p className="text-2xl lg:text-3xl  text-black ">Prime Monthly</p>
          <p className="text-sm bg-[#F7EDE1] text-[#C8102E] px-4 py-1 rounded-lg  ">
            Your Subscription ends in 11 days
          </p>
        </div>
        <div className="flex items-center  gap-2">
          <button className="px-5 rounded-xl cursor-pointer hover:bg-transparent border border-[#8B0000] ease-in-out duration-500 bg-[#8B0000] py-2 text-white">
            Upgrade Now
          </button>
          <button className="px-5 rounded-xl cursor-pointer hover:bg-[#8B0000] hover:text-white ease-in-out duration-500 border border-[#8B0000] text-[#8B0000] py-2 ">
            Switch to Premium
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full gap-4">
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <p className="text-[#4B4B4B] text-sm font-semibold">Current tier</p>
            <div className="flex items-center gap-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                  fill="#FAD94A"
                />
                <path
                  d="M9.97187 2.65928H9.95625C9.62656 6.73115 6.24063 9.93897 2.09375 9.98272V10.0187C6.24063 10.0624 9.62656 13.2702 9.95625 17.3421H9.97187C10.3031 13.2468 13.7281 10.0249 17.9078 10.0171V9.98272C13.7281 9.97647 10.3047 6.75459 9.97187 2.65771V2.65928Z"
                  fill="white"
                />
              </svg>
              <p className="text-[#8B0000] font-semibold">PRIME</p>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-[#EBF0F1]"></div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <p className="text-[#4B4B4B] text-sm font-semibold">
              Billing date{" "}
            </p>

            <p className="text-black">05th of March - 03rd of April, 2025</p>
          </div>
          <div className="h-2 w-full rounded-full bg-[#EBF0F1]"></div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <p className="text-[#4B4B4B] text-sm font-semibold">Amount</p>

            <p className="text-[#8B0000] font-bold">$2,300</p>
          </div>
          <div className="h-2 w-full rounded-full bg-[#EBF0F1]"></div>
        </div>
      </div>
    </div>
  );
}
