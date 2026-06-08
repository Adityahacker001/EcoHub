"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, Send } from "lucide-react";

export default function ContactForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast({ title: "Missing details", description: "Please add subject and message." });
      return;
    }
    setSubmitting(true);
    try {
      // Placeholder: integrate API for ticket submission later
      await new Promise((res) => setTimeout(res, 600));
      toast({ title: "Ticket submitted", description: "We’ll get back to you shortly." });
      setSubject("");
      setMessage("");
      setFiles([]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="relative overflow-hidden border-gray-100 bg-white/95">
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-pink-200 via-orange-200 to-yellow-200 blur-3xl" />
      </div>
      <CardHeader>
        <CardTitle className="text-slate-900">Contact Support</CardTitle>
        <CardDescription className="text-slate-700">Share details and attach files if needed.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-700 mb-1">Your Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="bg-white border-gray-100 text-slate-900 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs text-slate-700 mb-1">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className="bg-white border-gray-100 text-slate-900 placeholder:text-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-700 mb-1">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary" className="bg-white border-gray-100 text-slate-900 placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-xs text-slate-700 mb-1">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue or request" rows={6} className="w-full rounded-md bg-white border border-gray-100 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60" />
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <Paperclip className="h-4 w-4" />
              <span className="text-sm">Attach files</span>
              <input type="file" multiple className="hidden" onChange={onFileChange} />
            </label>
            {files.length > 0 && (
              <span className="text-xs text-slate-600">{files.length} file(s) selected</span>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-500 hover:to-blue-500">
              <Send className="h-4 w-4 mr-2" />
              Submit Ticket
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
