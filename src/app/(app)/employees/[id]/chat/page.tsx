import type { Metadata } from "next";
import { ChatView } from "@/modules/employees";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "AI Chat" };

export default async function ChatPage({ params }: Props) {
  const { id } = await params;
  return <ChatView employeeId={id} />;
}
