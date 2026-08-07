"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo81({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-hutri-81.png"
      alt="Logo Resmi HUT RI ke-81 Tahun 2026"
      width={240}
      height={240}
      priority
      className={cn("object-contain shrink-0", className)}
    />
  );
}
