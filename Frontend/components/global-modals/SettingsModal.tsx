"use client";
import React from "react";
import ModalWrapper from "@/components/global-modals/ModalWrapper";
import { useGlobalModal } from "@/context/GlobalModalContext";
import { X } from "lucide-react";

export default function SettingsModal() {
  const { modalType, closeModal } = useGlobalModal();
  const open = modalType === "settings";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [notify, setNotify] = React.useState(true);
  const [dark, setDark] = React.useState(false);

  return (
    <ModalWrapper open={open} onClose={closeModal}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">Settings</h3>
            <p className="text-sm text-slate-600">Manage your profile and preferences.</p>
          </div>
          <button className="text-slate-600 p-1 rounded-full" onClick={closeModal}><X /></button>
        </div>

        <div className="mt-4">
          <div className="flex space-x-4">
            <button className="px-3 py-2 bg-slate-100 rounded-md">Profile</button>
            <button className="px-3 py-2 bg-transparent rounded-md">Password</button>
            <button className="px-3 py-2 bg-transparent rounded-md">Preferences</button>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-slate-700">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 px-3 py-2 rounded-md border" />
            </div>
            <div>
              <label className="text-sm text-slate-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 px-3 py-2 rounded-md border" />
            </div>
            <div>
              <label className="text-sm text-slate-700">Change Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full mt-2 px-3 py-2 rounded-md border" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-slate-600">Receive updates and alerts</p>
              </div>
              <input type="checkbox" checked={notify} onChange={() => setNotify(!notify)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-slate-600">Toggle UI theme</p>
              </div>
              <input type="checkbox" checked={dark} onChange={() => setDark(!dark)} />
            </div>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border rounded-md" onClick={closeModal}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={closeModal}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
