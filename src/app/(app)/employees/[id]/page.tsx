import type { Metadata } from "next";
import { EmployeeDetailView } from "@/modules/employees";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Employee — ${id}` };
}

export default async function EmployeeDetailPage({ params }: Props) {
  const { id } = await params;
  return <EmployeeDetailView id={id} />;
}
