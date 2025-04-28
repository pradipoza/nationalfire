import React from "react";
import ContactManager from "@/components/admin/ContactManager";

const AdminContact: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Contact Information</h1>
        <p className="text-gray-500">Manage contact details and customer inquiries</p>
      </div>
      
      <ContactManager />
    </div>
  );
};

export default AdminContact;
