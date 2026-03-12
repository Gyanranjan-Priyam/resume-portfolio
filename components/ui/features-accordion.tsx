"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Globe,
  Layers,
  Shield,
  GraduationCap,
  CreditCard,
  LayoutDashboard,
  ShoppingCart,
  Package,
  UserCog,
} from "lucide-react";

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  "Public Portal": <Globe className="size-4 text-green-500" />,
  "Admin Dashboard": <Layers className="size-4 text-blue-500" />,
  "Auth & Security": <Shield className="size-4 text-amber-500" />,
  "Student Experience": <GraduationCap className="size-4 text-violet-500" />,
  "Admin / Instructor": <Layers className="size-4 text-blue-500" />,
  "Payments": <CreditCard className="size-4 text-green-500" />,
  "Dashboard & UI": <LayoutDashboard className="size-4 text-indigo-500" />,
  "Student Portal": <GraduationCap className="size-4 text-violet-500" />,
  "Admin Suite": <Layers className="size-4 text-blue-500" />,
  "Finance Management": <CreditCard className="size-4 text-emerald-500" />,
  "Point of Sale": <ShoppingCart className="size-4 text-orange-500" />,
  "Inventory": <Package className="size-4 text-cyan-500" />,
  "Finance & Payments": <CreditCard className="size-4 text-green-500" />,
  "User Management": <UserCog className="size-4 text-purple-500" />,
};

interface FeatureGroup {
  category: string;
  items: string[];
}

export function FeaturesAccordion({ features }: { features: FeatureGroup[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className="divide-y rounded-lg border overflow-hidden">
      {features.map((group, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-2 bg-background px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              <span className="flex items-center gap-2">
                {FEATURE_ICONS[group.category] ?? <Layers className="size-4 text-muted-foreground" />}
                <span className="text-sm font-semibold">{group.category}</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {group.items.length}
                </span>
              </span>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            <div
              className="grid transition-all duration-200"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <ul className="divide-y border-t bg-muted/20">
                  {group.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2.5 px-4 py-2.5">
                      <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
