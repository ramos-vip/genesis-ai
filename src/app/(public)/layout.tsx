/**
 * Public layout — marketing pages (About, Blog, Press, etc.)
 * The root landing page (/) uses the root layout directly.
 */
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
