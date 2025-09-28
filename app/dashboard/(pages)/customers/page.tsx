"use client";

import CustomersTable from "@/components/dashboard/CustomersTable";
import axios from "axios";
import { useState, useEffect } from "react";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/get-customers");

      if (!response) {
        setLoading(false);
      }
      setCustomers(response.data);
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      // Error is caught but not displayed as the table handles empty state
      console.log("Failed to fetch customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Customers
          </h1>
          <p className="text-sm lg:text-base text-dark-base">List of your customers who placed orders.</p>
        </div>
      <CustomersTable customers={customers} loading={loading} />
    </div>
  );
};

export default CustomerPage;
