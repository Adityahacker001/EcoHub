"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="space-y-6">
      <Card className="border-gray-100 bg-white/95">
        <CardHeader>
          <CardTitle className="text-slate-900">Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-700 mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="bg-white border-gray-100 text-slate-900 placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-xs text-slate-700 mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className="bg-white border-gray-100 text-slate-900 placeholder:text-slate-400" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-500 hover:to-blue-500">Save Profile</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100 bg-white/95">
        <CardHeader>
          <CardTitle className="text-slate-900">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-700 mb-1">Current Password</label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-white border-gray-100 text-slate-900 placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-xs text-slate-700 mb-1">New Password</label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-white border-gray-100 text-slate-900 placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-xs text-slate-700 mb-1">Confirm Password</label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-white border-gray-100 text-slate-900 placeholder:text-slate-400" />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-500 hover:to-blue-500">Update Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100 bg-white/95">
        <CardHeader>
          <CardTitle className="text-slate-900">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="inline-flex items-center gap-2 text-slate-700">
            <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            <span>Email notifications</span>
          </label>
          <label className="inline-flex items-center gap-2 text-slate-700">
            <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            <span>Dark mode</span>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
