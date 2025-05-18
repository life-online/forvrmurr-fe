"use client";
import { CustomTableHeader } from "@/models/utils.model";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

type TableProps = {
  headers: CustomTableHeader[];
  render: () => React.ReactNode;
};

export default function CustomTable({ headers, render }: TableProps) {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const toggleDropdown = (id: string) => {
    if (dropdownOpen === id) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(id);
    }
  };
  return (
    <table className="rounded-xl w-full">
      <thead>
        <tr className="bg-lightPurple-20  ">
          {headers.map((item, index) => (
            <th
              key={index}
              className={`font-normal ${
                index === 0 ? "text-left px-5 " : "text-center "
              }`}
            >
              <div
                className={`flex text-black  items-center gap-1 ${
                  index === 0
                    ? "text-left w-fit "
                    : "text-center w-fit justify-center"
                }`}
              >
                <p>{item.name}</p>
                {item.sortable && (
                  <>
                    <FaChevronDown
                      onClick={() => {
                        toggleDropdown(item.name);
                      }}
                    />
                    {dropdownOpen === item.name && (
                      <div className="absolute z-40 right-0 z-10 mt-2 w-36 rounded-md shadow-lg bg-white border border-slate-100">
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
                    {/* <Menu.Root>
                        <Menu.Trigger>
                          <ExpandMoreIcon className='cursor-pointer' />
                        </Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Positioner sideOffset={8}>
                            <Menu.Popup className='bg-white border py-2 rounded-lg'>
                              {item.sortable &&
                                item.sortValues &&
                                item.sortValues.map((sorter, index) => (
                                  <Menu.Item
                                    key={index}
                                    className='bg-white hover:bg-[#fafafa] p-2 cursor-pointer'
                                    onClick={() => {
                                      if (item.sortFunction) {
                                        item.sortFunction(item.name.toLowerCase(), sorter.toUpperCase());
                                      }
                                    }}>
                                    {sorter}
                                  </Menu.Item>
                                ))}
                            </Menu.Popup>
                          </Menu.Positioner>
                        </Menu.Portal>
                      </Menu.Root> */}
                  </>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{render()}</tbody>
    </table>
  );
}
