import React from "react";
import ProductManager from "@/components/admin/ProductManager";

const AdminProducts: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <p className="text-gray-500">Add, edit, and manage your product catalog</p>
      </div>
      
      <ProductManager />
    </div>
  );
};

export default AdminProducts;
