export default function AccountActions() {
  return (
    <div className="flex flex-col gap-8 w-full  bg-white rounded-xl p-3">
      <p className="text-xl lg:text-2xl text-black ">Account Actions</p>

      <div className="flex flex-wrap gap-2 items-center w-full justify-center">
        <button className="p-5 max-w-[202px] rounded-xl cursor-pointer hover:bg-[#8B0000] hover:text-white ease-in-out duration-500 border border-[#8B000060] text-[#8B0000] ">
          Pause Subscription
        </button>
        <button className="p-5 max-w-[202px] rounded-xl cursor-pointer hover:bg-[#8B0000] hover:text-white ease-in-out duration-500 border border-[#8B000060] text-[#8B0000] ">
          Cancel Subscription
        </button>
        <button className="p-5 max-w-[202px] rounded-xl cursor-pointer hover:bg-[#8B0000] hover:text-white ease-in-out duration-500 border border-[#8B000060] text-[#8B0000] ">
          Change Billing Info
        </button>
        <button className="p-5 max-w-[202px] rounded-xl cursor-pointer hover:bg-[#8B0000] hover:text-white ease-in-out duration-500 border border-[#8B000060] text-[#8B0000] ">
          View Order History
        </button>
      </div>
    </div>
  );
}
