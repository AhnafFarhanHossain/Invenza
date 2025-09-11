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
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-light text-black tracking-wide mb-4">
        Customers
      </h1>
      <CustomersTable customers={customers} loading={loading} />
    </div>
  );
};

export default CustomerPage;
