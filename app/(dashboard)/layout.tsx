import { AuthGuard } from "@/components/shared/auth-guard";
import { Sidebar } from "@/components/shared/sidebar";
import { DashboardTopbar } from "@/components/shared/dashboard-topbar";
import { CommandPalette } from "@/components/shared/command-palette";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <CommandPalette />
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardTopbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  
  );
}