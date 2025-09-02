import ProtectedRoute from "@/components/auth/ProtectedRoute";

function PengaturanContent() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold">Pengaturan</h1>
            <p className="mt-2 text-gray-600">Atur preferensi akun Anda di sini.</p>
        </div>
    );
}

export default function PengaturanPage() {
    return (
        <ProtectedRoute>
            <PengaturanContent />
        </ProtectedRoute>
    );
}