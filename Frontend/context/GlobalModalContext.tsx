"use client";
import React from "react";

type ModalType = "contact" | "help" | "settings" | null;

interface ContextValue {
  openModal: (t: Exclude<ModalType, null>) => void;
  closeModal: () => void;
  modalType: ModalType;
}

const GlobalModalContext = React.createContext<ContextValue | undefined>(undefined);

export const GlobalModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalType, setModalType] = React.useState<ModalType>(null);

  const openModal = (t: Exclude<ModalType, null>) => setModalType(t);
  const closeModal = () => setModalType(null);

  return (
    <GlobalModalContext.Provider value={{ openModal, closeModal, modalType }}>
      {children}
    </GlobalModalContext.Provider>
  );
};

export function useGlobalModal() {
  const ctx = React.useContext(GlobalModalContext);
  if (!ctx) throw new Error("useGlobalModal must be used within GlobalModalProvider");
  return ctx;
}
