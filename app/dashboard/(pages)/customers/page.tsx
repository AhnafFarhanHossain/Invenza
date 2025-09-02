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
      console.error("Error fetching customers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h1 className="font-bold text-4xl mb-8">Customers List</h1>
      <CustomersTable customers={customers} loading={loading} />
    </div>
  );
};

export default CustomerPage;
