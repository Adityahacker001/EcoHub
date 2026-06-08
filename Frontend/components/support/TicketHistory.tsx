"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Ticket = {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved";
  updatedAt: string;
  summary: string;
};

const SAMPLE_TICKETS: Ticket[] = [
  { id: "TCK-1023", subject: "Attendance sync issue", status: "resolved", updatedAt: "2025-01-12", summary: "Resolved after server-side fix." },
  { id: "TCK-1034", subject: "Unable to upload documents", status: "in-progress", updatedAt: "2025-01-11", summary: "Investigation ongoing; temporary workaround provided." },
  { id: "TCK-1047", subject: "Grievance tracker slow", status: "open", updatedAt: "2025-01-10", summary: "Performance analysis scheduled for next release." },
];

const statusColor: Record<Ticket["status"], string> = {
  open: "bg-pink-200",
  "in-progress": "bg-yellow-200",
  resolved: "bg-emerald-200",
};

export default function TicketHistory({ tickets = SAMPLE_TICKETS }: { tickets?: Ticket[] }) {
  return (
    <Card className="border-gray-100 bg-white/95">
      <CardHeader>
        <CardTitle className="text-slate-900">Ticket History</CardTitle>
        <CardDescription className="text-slate-700">Recent support interactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="rounded-xl border border-gray-100 bg-white p-3">
            <div className="flex items-center justify-between">
              <div className="text-slate-900 font-medium">{t.subject}</div>
              <Badge className={`${statusColor[t.status]} text-slate-900`}>{t.status}</Badge>
            </div>
            <div className="text-xs text-slate-600 mt-1">{t.id} • Updated {t.updatedAt}</div>
            <div className="text-sm text-slate-700 mt-2">{t.summary}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
