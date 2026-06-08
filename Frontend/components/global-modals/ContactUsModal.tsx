"use client";
import React from "react";
import ModalWrapper from "@/components/global-modals/ModalWrapper";
import { useGlobalModal } from "@/context/GlobalModalContext";
import { X } from "lucide-react";

export default function ContactUsModal() {
  const { modalType, closeModal } = useGlobalModal();
  const open = modalType === "contact";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    // auto-fill logic placeholder
    setName("");
    setEmail("");
    setRole("");
  }, [open]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    // placeholder submit
    console.log({ name, email, phone, role, category, message });
    closeModal();
    // TODO: toast success
  };

  return (
    <ModalWrapper open={open} onClose={closeModal}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Contact Us</h3>
            <p className="text-sm text-slate-600">Tell us what's wrong — we'll get back to you.</p>
          </div>
          <button className="text-slate-600 p-1 rounded-full" onClick={closeModal}><X /></button>
        </div>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-slate-700">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 px-3 py-2 rounded-md border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 px-3 py-2 rounded-md border" />
            </div>
            <div>
              <label className="text-sm text-slate-700">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-2 px-3 py-2 rounded-md border" />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-700">Issue Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-2 px-3 py-2 rounded-md border">
              <option value="">Select Category</option>
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>Account Issue</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-700">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mt-2 px-3 py-2 rounded-md border h-28" />
          </div>
          <div className="flex items-center justify-end space-x-3">
            <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit Ticket</button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
