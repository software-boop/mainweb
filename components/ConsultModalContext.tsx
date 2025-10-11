"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import ConsultModal, {
  type ConsultFormValues,
} from "../components/ConsultModal";

type Ctx = {
  open: (defaults?: Partial<ConsultFormValues>) => void;
  close: () => void;
};

const ConsultCtx = createContext<Ctx | null>(null);

export function ConsultModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [initials, setInitials] = useState<
    Partial<ConsultFormValues> | undefined
  >(undefined);

  const open = useCallback((defaults?: Partial<ConsultFormValues>) => {
    setInitials(defaults);
    setVisible(true);
  }, []);

  const close = useCallback(() => setVisible(false), []);

  return (
    <ConsultCtx.Provider value={{ open, close }}>
      {children}
      <ConsultModal open={visible} onClose={close} initialValues={initials} />
    </ConsultCtx.Provider>
  );
}

export function useConsultModal() {
  const ctx = useContext(ConsultCtx);
  if (!ctx)
    throw new Error(
      "useConsultModal must be used within <ConsultModalProvider>"
    );
  return ctx;
}
