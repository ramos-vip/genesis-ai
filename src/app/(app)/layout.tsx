import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/constants";
import Sidebar from "./_components/Sidebar";
import TopBar  from "./_components/TopBar";

/**
 * Second layer of auth protection.
 * proxy.ts handles it at the network layer; this handles it at the render layer.
 * Defense in depth: both must pass for dashboard content to render.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect(ROUTES.AUTH.LOGIN);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-6 lg:p-8"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
