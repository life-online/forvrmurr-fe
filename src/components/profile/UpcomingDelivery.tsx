"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { IoEllipsisHorizontal, IoSearchOutline } from "react-icons/io5";
// import CustomTable from "../ui/CustomTable";
// import { CustomTableHeader } from "@/models/utils.model";

export type DataItem = {
  id: number;
  name: string;
  type: "Prime" | "Premium";
  date: string;
  status: "Pending" | "Completed";
};
const data: DataItem[] = [
  {
    id: 1,
    name: "Boadecia Complex",
    type: "Prime",
    date: "1st July 2025",
    status: "Pending",
  },
  {
    id: 2,
    name: "Boadecia Complex",
    type: "Premium",
    date: "1st July 2025",
    status: "Completed",
  },
];

export default function UpcomingDeliveryCard() {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback((id: number) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  }, []);
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleDeliveryType = useCallback((type: "Prime" | "Premium") => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          type === "Prime"
            ? "text-[#520100] bg-[#BE9E77] border border-amber-300"
            : "text-[#C01048] bg-[#520100]"
        }
      `}
      >
        <span className="mr-1.5 w-2 h-2 rounded-full bg-current"></span>
        {type}
      </span>
    );
  }, []);
  const handleDeliveryStatus = useCallback(
    (status: "Pending" | "Completed") => {
      return (
        <span
          className={`inline-block px-2.5 py-1 rounded-md text-sm font-medium ${
            status === "Pending"
              ? "text-amber-600 bg-amber-50"
              : "text-green-600 bg-green-50"
          }
          `}
        >
          {status}
        </span>
      );
    },
    []
  );
  return (
    <div className="flex flex-col gap-5 w-full  bg-white rounded-xl p-3">
      <div className="flex items-center w-full justify-between">
        <p className="text-xl lg:text-2xl text-black "> My Upcoming Delivery</p>
        <div className="flex items-center  gap-2">
          <div className="flex text-black items-center">
            <p className="text-sm">Sort by :</p>
            <select className="border-none">
              <option value="">all</option>
            </select>
          </div>
          <div
            className={` flex ${
              showInput ? "px-5 gap-2 w-fit py-2" : "py-2 px-4 w"
            } cursor-pointer border border-[#E7E9F1] text-black ease-in-out duration-700 rounded-full  items-center`}
            onMouseEnter={() => setShowInput(true)}
            onMouseLeave={() => setShowInput(false)}
          >
            <IoSearchOutline />

            <input
              type="text"
              className={`border-none outline-none bg-transparent transition-all ease-in-out duration-700 ${
                showInput ? "w-18 opacity-100" : "w-0 opacity-0"
              }`}
              placeholder="Search"
              onBlur={() => setShowInput(false)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              //   onKeyDown={(e) => {
              //     if (e.key === "Enter") {
              //       router.push({
              //         pathname: `/search`,
              //         query: { search: searchTerm },
              //       });
              //     }
              //   }}
            />
          </div>

          <button className="px-5 rounded-xl cursor-pointer hover:bg-transparent border border-[#8B0000] hover:text-[#8B0000] ease-in-out duration-500 bg-[#8B0000] py-2 text-white">
            Pause Subscription
          </button>
        </div>
      </div>

      <div className=" rounded-md w-full ">
        <table className="w-full border-collapse">
          <thead>
            <tr className="">
              <th className="w-12 p-3 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    className="h-4 w-4"
                  />
                </div>
              </th>
              <th className="w-12 border-l border-[#00000010] p-3 text-left font-medium text-slate-500">
                S/N
              </th>
              <th className="p-3 text-left border-l border-[#00000010] font-medium text-slate-500">
                Name
              </th>
              <th className="p-3 text-left border-l border-[#00000010] font-medium text-slate-500">
                Type
              </th>
              <th className="p-3 text-left border-l border-[#00000010] font-medium text-slate-500">
                Date
              </th>
              <th className="p-3 text-left border-l border-[#00000010] font-medium text-slate-500">
                Status
              </th>
              <th className="w-12 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="p-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      aria-label={`Select row ${item.id}`}
                      className="h-4 w-4"
                    />
                  </div>
                </td>
                <td className="p-3 text-black font-medium">{item.id}</td>
                <td className="p-3 text-black font-medium">{item.name}</td>
                <td className="p-3">{handleDeliveryType(item.type)}</td>
                <td className="p-3 text-black">
                  <div className="flex items-center">
                    <BiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                    {item.date}
                  </div>
                </td>
                <td className="p-3">{handleDeliveryStatus(item.status)}</td>
                <td className="p-3 text-black relative">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 transition-colors hover:bg-slate-100"
                    onClick={() => toggleDropdown(item.id)}
                  >
                    <IoEllipsisHorizontal />
                    <span className="sr-only">Open menu</span>
                  </button>
                  {dropdownOpen === item.id && (
                    <div className="absolute right-0 z-50 mt-2 w-36 rounded-md shadow-lg bg-white border border-slate-100">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                          role="menuitem"
                          onClick={() => setDropdownOpen(null)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                          role="menuitem"
                          onClick={() => setDropdownOpen(null)}
                        >
                          View Details
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                          role="menuitem"
                          onClick={() => setDropdownOpen(null)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
