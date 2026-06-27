import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/constants";

/**
 * Auth layout — handles the authenticated-user redirect.
 * Visual layout is owned by each page via AuthSplitLayout.
 */
export default async function AuthLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (userId) redirect(ROUTES.APP.DASHBOARD);
  return <>{children}</>;
}
