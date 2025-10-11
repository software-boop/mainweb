import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";

export default async function DashboardIndex() {
  const session = await getSession();
  if (!session) redirect("/login");
  const role = session.role; // "superadmin" | "admin" | "user"
  if (role === "superadmin") redirect("/dashboard/superadmin");
  if (role === "admin") redirect("/dashboard/admin");
  redirect("/dashboard/user");
}
