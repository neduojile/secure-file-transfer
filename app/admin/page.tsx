import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import AdminSecurityCenter from "@/components/dashboard/admin-security-center";
import AdminUserManagement from "@/components/dashboard/admin-user-management";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div>
      <AdminSecurityCenter />
      <div className="mx-auto max-w-[1800px] px-4 pb-10 sm:px-6 lg:px-8">
        <AdminUserManagement />
      </div>
    </div>
  );
}
