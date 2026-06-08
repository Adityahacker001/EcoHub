"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupportModal({
  title,
  subtitle,
  children,
  open = true,
  onOpenChange,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  // If an onOpenChange handler is provided we treat the modal as controlled.
  // Otherwise use defaultOpen so the dialog can be closed by Radix internally.
  const rootProps: any = typeof onOpenChange === "function"
    ? { open, onOpenChange }
    : { defaultOpen: open };

  return (
    <Dialog.Root {...rootProps}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-white/40 backdrop-blur-sm" />

        <Dialog.Content className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/95 shadow-2xl",
          "border border-gray-100 overflow-hidden"
        )}>
          <div className="relative">
            <div className="absolute -inset-x-2 -top-2 h-36 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600" />
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200 flex items-center justify-center">
                    {/* decorative icon space */}
                  </div>
                  <div>
                    <div className="text-slate-900 text-lg font-semibold">{title}</div>
                    {subtitle && <div className="text-slate-700 text-sm">{subtitle}</div>}
                  </div>
                </div>
                <Dialog.Close className="h-9 w-9 rounded-full bg-white shadow flex items-center justify-center">
                  <X className="h-4 w-4 text-slate-700" />
                </Dialog.Close>
              </div>
            </div>
            <div className="relative z-10 border-t border-gray-100 bg-transparent" />
          </div>

          <div className="p-6 bg-transparent">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
