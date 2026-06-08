"use client";
import React from "react";
import ModalWrapper from "@/components/global-modals/ModalWrapper";
import { useGlobalModal } from "@/context/GlobalModalContext";
import { X } from "lucide-react";

export default function HelpSupportModal() {
  const { modalType, closeModal } = useGlobalModal();
  const open = modalType === "help";

  return (
    <ModalWrapper open={open} onClose={closeModal}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Help & Support</h3>
            <p className="text-sm text-slate-600">Find FAQs and resources.</p>
          </div>
          <button className="text-slate-600 p-1 rounded-full" onClick={closeModal}><X /></button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">FAQ</h4>
            <div className="space-y-2">
              <details className="p-3 border rounded"><summary className="cursor-pointer">How to create a user?</summary><div className="mt-2 text-sm text-slate-600">Use the Add User button in User Management.</div></details>
              <details className="p-3 border rounded"><summary className="cursor-pointer">How to raise a ticket?</summary><div className="mt-2 text-sm text-slate-600">Use Contact Us modal to submit a ticket.</div></details>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Knowledge Base</h4>
            <ul className="space-y-2">
              <li><a className="text-blue-600 underline" href="#">User Guide (PDF)</a></li>
              <li><a className="text-blue-600 underline" href="#">Onboarding Checklist (PDF)</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-2">Recent Tickets</h4>
          <div className="space-y-3">
            <details className="p-3 border rounded"><summary className="cursor-pointer font-medium">Ticket #12345 - Login Issue</summary><div className="mt-2 text-sm text-slate-600">We are investigating.</div></details>
            <details className="p-3 border rounded"><summary className="cursor-pointer font-medium">Ticket #12290 - Report Error</summary><div className="mt-2 text-sm text-slate-600">Resolved in v1.2.3.</div></details>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
