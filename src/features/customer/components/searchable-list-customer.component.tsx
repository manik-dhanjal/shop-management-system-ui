import { TextField } from "@mui/material";
import { usePaginatedCustomers } from "../hooks/use-get-paginated-customers.hook";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { DotBounceLoading } from "@shared/components/dot-bounce-loading.component";
import { CustomerPopulated } from "@features/customer/interface/customer.interface";

const DEBOUNCE_DELAY = 1000; // 1 second debounce

export interface SearchableListCustomerProps {
  onCustomerSelect: (customer: any) => void; // Replace 'any' with actual Customer type
}

export const SearchableListCustomer = ({
  onCustomerSelect,
}: SearchableListCustomerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [allCustomers, setAllCustomers] = useState<CustomerPopulated[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top when new search results come in
  useEffect(() => {
    if (scrollContainerRef.current && page === 1 && allCustomers.length > 0) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [debouncedSearchTerm, page, allCustomers.length]);

  // Debounce search term - only update API search after 300ms of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset page to 1 when search term changes
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search customers using fuzzy search with debounced term
  const { data: customersData, isLoading: isSearching } = usePaginatedCustomers(
    10,
    page,
    debouncedSearchTerm || undefined,
  );

  const handleLoadMore = () => {
    if (customersData?.pagination?.nextPage) {
      setPage(customersData.pagination.nextPage);
    }
  };

  useEffect(() => {
    if (customersData?.docs) {
      if (page === 1) {
        setAllCustomers(customersData.docs);
      } else {
        setAllCustomers((prev) => [...prev, ...customersData.docs]);
      }
    }
  }, [customersData?.docs, page]);

  return (
    <div className="space-y-4">
      <TextField
        type="text"
        label="Search Customers"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name or phone..."
        className="w-full"
        slotProps={{
          input: {
            style: { borderRadius: "8px", width: "100%" },
          },
        }}
      />

      {isSearching ? (
        <div className="p-4 text-center text-gray-500 flex justify-center h-[calc(100vh-250px)] items-center">
          <DotBounceLoading size="w-2" />
        </div>
      ) : allCustomers.length > 0 ? (
        <div
          ref={scrollContainerRef}
          id="scrollable-customer-list"
          className="h-[calc(100vh-250px)] border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800"
        >
          <InfiniteScroll
            dataLength={allCustomers.length}
            next={handleLoadMore}
            hasMore={
              customersData?.pagination?.nextPage !== null &&
              customersData?.pagination?.nextPage !== undefined
            }
            loader={
              <div className="p-4 flex justify-center">
                <DotBounceLoading size="w-1.5" color="bg-blue-500" />
              </div>
            }
            scrollableTarget="scrollable-customer-list"
            className="space-y-2 p-2"
            scrollThreshold="100px"
          >
            {allCustomers.map((customer, index) => (
              <div key={customer._id + index + "customer-list"}>
                <button
                  onClick={() => onCustomerSelect(customer)}
                  className="w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-gray-600"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-50">
                    {customer.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {customer.phone}
                    {customer.email && ` • ${customer.email}`}
                  </div>
                </button>
                <hr className="border-gray-200 dark:border-gray-700 my-2 mx-auto" />
              </div>
            ))}
          </InfiniteScroll>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 h-[calc(100vh-250px)] flex items-center justify-center">
          {searchTerm
            ? "No customers found"
            : "Enter search term to find customers"}
        </div>
      )}
    </div>
  );
};
