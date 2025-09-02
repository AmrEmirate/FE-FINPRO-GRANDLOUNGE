import Sidebar from "@/components/Dashboard/akun_user/Sidebar";  // Kita akan buat file ini selanjutnya
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AkunUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8 bg-gray-50/50">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}