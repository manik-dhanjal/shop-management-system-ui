import { useState } from "react";
import { Link } from "react-router-dom";
import { InputAdornment, TextField } from "@mui/material";
import { IoSearch } from "react-icons/io5";

function ProductSearchBar() {
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  return (
    <>
      <div className="relative">
        {/* Search form */}
        <div
          className="relative"
          onFocus={() => setIsSuggestionOpen(true)}
          onBlur={() => setIsSuggestionOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsSuggestionOpen(false);
            }
          }}
        >
          <TextField
            placeholder="Search Product or Category..."
            className="w-full rounded-lg"
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" className="cursor-pointer">
                    <IoSearch className="text-xl" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
        {isSuggestionOpen && (
          // Modal backdrop
          <div className="py-4 px-2 absolute left-0 right-0  top-0 z-10 w-full max-w-lg mx-auto mt-16 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
            {/* Recent searches */}
            <div className="mb-3 last:mb-0">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">
                Recent searches
              </div>
              <ul className="text-sm">
                <li>
                  <Link
                    className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                    to="#0"
                  >
                    <svg
                      className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                    </svg>
                    <span>Form Builder - 23 hours on-demand video</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                    to="#0"
                  >
                    <svg
                      className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                    </svg>
                    <span>Access Mosaic on mobile and TV</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                    to="#0"
                  >
                    <svg
                      className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                    </svg>
                    <span>Product Update - Q4 2024</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                    to="#0"
                  >
                    <svg
                      className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                    </svg>
                    <span>Master Digital Marketing Strategy course</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                    to="#0"
                  >
                    <svg
                      className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                    </svg>
                    <span>Dedicated forms for products</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                    to="#0"
                  >
                    <svg
                      className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                    </svg>
                    <span>Product Update - Q4 2024</span>
                  </Link>
                </li>
              </ul>
            </div>
            {/* Recent pages */}
            <div className="mb-3 last:mb-0">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">
                Recent pages
              </div>
              <ul className="text-sm">
                <li>
                  <Link
                    className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                    to="#0"
                  >
                    <svg
                      className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z" />
                    </svg>
                    <span>
                      <span className="font-medium">Messages</span> -{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        Conversation / … / Mike Mills
                      </span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                    to="#0"
                  >
                    <svg
                      className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z" />
                    </svg>
                    <span>
                      <span className="font-medium">Messages</span> -{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        Conversation / … / Eva Patrick
                      </span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductSearchBar;
