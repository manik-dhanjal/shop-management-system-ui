import React, { useState } from "react";
import Modal from "@shared/components/hoc/modal.component";
import { CustomerForm, INITIAL_FORM_VALUES } from "./customer-form.component";
import { useAddCustomer } from "@features/customer/hooks/use-add-customer.hook";
import {
  Customer,
  CustomerFormTypes,
  CustomerPopulated,
} from "@features/customer/interface/customer.interface";
import { SearchableListCustomer } from "./searchable-list-customer.component";
import { usePutCustomer } from "../hooks/use-put-customer.hook";

interface CustomerSelectModalProps {
  close: () => void;
  onCustomerSelect: (customer: CustomerPopulated) => void;
}

export const CustomerSelectModal: React.FC<CustomerSelectModalProps> = ({
  close,
  onCustomerSelect,
}) => {
  const [activeTab, setActiveTab] = useState<"search" | "add">("search");

  // Add customer mutation
  const putCustomerMutation = usePutCustomer();

  const handleCustomerSelect = (customer: CustomerPopulated) => {
    onCustomerSelect(customer);
    close();
  };

  const handleAddCustomer = async (formData: CustomerFormTypes) => {
    console.log(formData);
    try {
      const a = await putCustomerMutation.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        billingAddress: formData.billingAddress,
        shippingAddress: formData.shippingAddress,
        gstin: formData.gstin,
      });
      onCustomerSelect(a);
      close();
      // The mutation handles navigation, so we'll be redirected
    } catch (error) {
      console.error("Failed to add customer:", error);
    }
  };

  return (
    <Modal
      title="Select or Add Customer"
      onClose={close}
      className="w-[95vw] max-w-[600px]"
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "search"
                ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            Search Customers
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "add"
                ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            Add New Customer
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <SearchableListCustomer onCustomerSelect={handleCustomerSelect} />
        )}

        {/* Add New Tab */}
        {activeTab === "add" && (
          <CustomerForm
            onSubmit={handleAddCustomer}
            isLoading={putCustomerMutation.isPending}
            initialCustomerData={INITIAL_FORM_VALUES}
          />
        )}
      </div>
    </Modal>
  );
};
