"use client";

import { useToast } from "@/context/ToastContext";
import orderService, { Order } from "@/services/orders";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
// import CustomTable from "../ui/CustomTable";
// import { CustomTableHeader } from "@/models/utils.model";
function formatIsoStringToDate(isoString: string): string {
  try {
    const date = new Date(isoString);

    // Check if the date is valid.
    // Invalid Date objects return NaN for getTime().
    if (isNaN(date.getTime())) {
      console.error("Invalid date string provided:", isoString);
      return ""; // Or throw an error, depending on desired error handling
    }

    // Use Intl.DateTimeFormat for robust and locale-aware formatting.
    // 'en-US' is used for the specific "Month Day, Year" format.
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Error formatting date string:", error);
    return ""; // Return empty string on error
  }
}

export type DataItem = {
  id: number;
  name: string;
  type: "Prime" | "Premium";
  date: string;
  status: "Pending" | "Completed";
};

export default function UpcomingDeliveryCard() {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();
  const toggleDropdown = (id: string) => {
    if (dropdownOpen === id) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(id);
    }
  };
  const toggleRowExpansion = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

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
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await orderService.getmyorders();
      setOrders(response.data);
      // setCurrentPage(response.meta.page);
      // setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error("Error fetching products:", err);
      showError("Failed to load products. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // const handleDeliveryType = useCallback((type: "Prime" | "Premium") => {
  //   return (
  //     <span
  //       className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
  //         type === "Prime"
  //           ? "text-[#520100] bg-[#BE9E77] border border-amber-300"
  //           : "text-[#C01048] bg-[#520100]"
  //       }
  //     `}
  //     >
  //       <span className="mr-1.5 w-2 h-2 rounded-full bg-current"></span>
  //       {type}
  //     </span>
  //   );
  // }, []);
  const handleDeliveryStatus = useCallback((status: string) => {
    return (
      <span
        className={`inline-block px-2.5 py-1 rounded-md text-sm font-medium ${
          status === "Pending"
            ? "text-amber-600 bg-amber-50"
            : status === "Failed"
            ? "text-red-600 bg-red-50"
            : "text-green-600 bg-green-50"
        }
          `}
      >
        {status}
      </span>
    );
  }, []);

  if (loading) {
    return (
      <>
        <div className=" bg-[#f8f5f2]">
          <div className="w-full py-20 text-center">
            <div className="animate-pulse">
              <div className="h-12 w-64 bg-gray-200 rounded w-full mb-8"></div>
            </div>
            <p className="mt-8 text-gray-500">Loading Orders...</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="flex flex-col gap-5 w-full  bg-white rounded-xl p-3">
      <div className="flex md:flex-row flex-col items-center w-full justify-between">
        <p className="text-sm lg:text-2xl text-black "> My Upcoming Delivery</p>
        <div className="flex md:flex-row flex-col items-center  gap-2">
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

          {/* <button className="px-5 rounded-xl cursor-pointer hover:bg-transparent border border-[#8B0000] hover:text-[#8B0000] ease-in-out duration-500 bg-[#8B0000] py-2 text-white">
            Pause Subscription
          </button> */}
        </div>
      </div>

      <div className=" rounded-md w-full overflow-x-scroll">
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
              <th className="p-3 border-l border-[#00000010] p-3 text-left font-medium text-slate-500">
                order No
              </th>
              <th className="p-3 text-left border-l border-[#00000010] font-medium text-slate-500">
                Customer
              </th>
              <th className="p-3 text-left border-l border-[#00000010] font-medium text-slate-500">
                Payment Status
              </th>
              <th className="p-3 text-left border-l border-[#00000010] font-medium text-slate-500">
                Order Total
              </th>
              <th className="p-3 text-left border-l border-[#00000010] font-medium text-slate-500">
                Date
              </th>
              <th className="w-12 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item) => (
              <>
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
                  <td className="p-3 text-black font-medium">
                    {item.orderNumber}
                  </td>
                  <td className="p-3 text-black font-medium">
                    <div className="flex flex-col ">
                      <p className="text-sm text-mid-grey">
                        {item.billingAddress.firstName}
                        {item.billingAddress.lastName}
                      </p>
                      <p className="text-xs text-mid-grey">
                        {item.billingAddress.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    {handleDeliveryStatus(item.paymentStatus)}
                  </td>
                  <td className="p-3">₦{item.subtotal.toLocaleString()}</td>
                  <td className="p-3 text-black">
                    <div className="flex items-center">
                      <BiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                      {formatIsoStringToDate(item.createdAt)}
                    </div>
                  </td>

                  <td className="p-3 text-black relative">
                    <button
                      className="flex px-3 py-1 cursor-pointer items-center text-black justify-center rounded-full border border-slate-200 transition-colors hover:bg-slate-100"
                      onClick={() => toggleRowExpansion(item.id)}
                    >
                      {expandedRows.has(item.id) ? (
                        <>
                          Hide
                          {/* <ChevronUp className="ml-1 h-3 w-3" /> */}
                        </>
                      ) : (
                        <>
                          View
                          {/* <ChevronDown className="ml-1 h-3 w-3" /> */}
                        </>
                      )}
                    </button>
                  </td>
                </tr>
                {expandedRows.has(item.id) && (
                  <tr className="border-t border-slate-100 bg-slate-25">
                    <td colSpan={7} className="p-0">
                      <div className="px-6 py-4 bg-slate-50">
                        <h4 className="font-medium text-slate-700 mb-3">
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {item.items.map((item, index) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-slate-200"
                            >
                              <img
                                src={item.productImageUrl}
                                alt={item.productName}
                                className="w-12 h-12 object-cover rounded-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yMCAyMEwyOCAyOE0yOCAyMEwyMCAyOCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2Zz4K";
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-medium text-slate-800">
                                      {item.productName}
                                    </h5>
                                    <p className="text-sm text-slate-500">
                                      SKU: {item.productSku}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-slate-800">
                                      ₦{item.price.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2 text-right">
                                  <p className="text-sm font-medium text-slate-700">
                                    Subtotal: ₦{item.subtotal.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order summary */}
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Subtotal:</span>
                            <span className="font-medium">
                              ₦{item.subtotal.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-slate-600">Shipping:</span>
                            <span className="font-medium">
                              ₦{item.shippingCost.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-slate-600">Discount:</span>
                            <span className="font-medium text-green-600">
                              -₦{item.discount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-base font-semibold mt-2 pt-2 border-t border-slate-200">
                            <span>Total:</span>
                            <span>₦{item.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {dropdownOpen !== null && (
          <div
            ref={dropdownRef}
            className="fixed shadow-lg bg-white border border-slate-100 rounded-md py-1 z-50"
            style={{
              top: `${
                document
                  .querySelector(`[data-row-id="${dropdownOpen}"]`)
                  ?.getBoundingClientRect().bottom ?? 0
              }px`,
              right: `${
                window.innerWidth -
                (document
                  .querySelector(`[data-row-id="${dropdownOpen}"]`)
                  ?.getBoundingClientRect().right ?? 0)
              }px`,
            }}
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                role="menuitem"
                onClick={() => setDropdownOpen(null)}
              >
                View Order
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                role="menuitem"
                onClick={() => setDropdownOpen(null)}
              >
                Edit Order
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                role="menuitem"
                onClick={() => setDropdownOpen(null)}
              >
                Cancel Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
