import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSecurityCenter from "@/components/dashboard/admin-security-center-new";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/auth/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return <AdminSecurityCenter />;
}
