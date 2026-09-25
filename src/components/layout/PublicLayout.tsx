import React from "react";
import { Navbar } from "../common/Navbar";
import { GlobalFooter } from "./GlobalFooter";

interface PublicLayoutProps {
  children: React.ReactNode;
  isHome?: boolean;
}

/**
 * PublicLayout
 * 
 * Standard layout wrapper for all unauthenticated/public-facing website pages.
 * Enforces min-h-[100dvh] flex-col architecture with flex-1 main content area
 * and single canonical GlobalFooter pinned at the document end.
 */
export const PublicLayout: React.FC<PublicLayoutProps> = ({ children, isHome }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F6F0E7] text-[#342A24] w-full max-w-none m-0 p-0">
      {!isHome && <Navbar />}
      <main className="flex-1 flex flex-col w-full max-w-none m-0 p-0">{children}</main>
      <GlobalFooter />
    </div>
  );
};

export default PublicLayout;
