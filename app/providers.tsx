// app/providers.tsx
"use client";

import React from "react";
// import path whichever you used for the context file:
import { ConsultModalProvider } from "../components/ConsultModalContext";
// or: import { ConsultModalProvider } from "@/components/ConsultModalContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ConsultModalProvider>{children}</ConsultModalProvider>;
}
