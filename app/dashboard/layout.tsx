import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <DashboardSidebar />

      <div className="ml-64 flex h-screen flex-col">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}