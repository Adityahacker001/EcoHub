"use client";

import React, { useMemo, useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DEFAULT_FAQS = [
  { q: "How do I reset my password?", a: "Go to Settings → Change Password and follow the steps." },
  { q: "How can I track my grievance?", a: "Use Reports → Grievance Tracking or visit Help → Ticket History." },
  { q: "Where do I upload mandatory documents?", a: "Navigate to Profile and use the Upload Docs section." },
  { q: "How to contact district support?", a: "Use Support → Contact and choose District role in subject." },
  { q: "Why is my attendance not syncing?", a: "Check network connectivity and retry; if persists, contact support." },
  { q: "Can I edit a submitted report?", a: "Editing depends on role permissions; reach out to your admin." },
  { q: "What browsers are supported?", a: "Latest Chrome, Edge, and Firefox are recommended." },
  { q: "How do I view training materials?", a: "Open Reports → Training Coverage for links and summaries." },
  { q: "How do I nominate for recognition?", a: "Go to Data Entry → Recognition Nomination under your role." },
  { q: "How can I enable notifications?", a: "Use Settings → Preferences and toggle notification settings." },
  { q: "Where can I download guidelines?", a: "Find them under Help → Knowledge Base downloads." },
  { q: "Is dark mode available?", a: "Yes, toggle under Settings → Preferences." },
];

export default function FAQSection({ faqs = DEFAULT_FAQS }: { faqs?: { q: string; a: string }[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [faqs, query]);

  return (
    <Card className="border-gray-100 bg-white/95">
      <CardHeader>
        <CardTitle className="text-slate-900">FAQs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQs"
            className="bg-white border-gray-100 text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <Accordion type="single" collapsible className="text-slate-900">
          {filtered.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-white">
                <span className="text-slate-900">{item.q}</span>
              </AccordionTrigger>
              <AccordionContent className="text-slate-700">
                <p>{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
