import ProtectedRoute from "@/components/auth/ProtectedRoute";

function MetodePembayaranContent() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold">Metode Pembayaran</h1>
            <p className="mt-2 text-gray-600">Fitur untuk mengelola metode pembayaran Anda akan segera tersedia.</p>
        </div>
    );
}

export default function MetodePembayaranPage() {
    return (
        <ProtectedRoute>
            <MetodePembayaranContent />
        </ProtectedRoute>
    );
}