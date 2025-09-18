// src/components/auth/StatusDisplay.tsx
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

type Status = 'loading' | 'success' | 'error';

interface StatusDisplayProps {
    status: Status;
    message: string;
}

// Map status ke ikon dan warna
const statusConfig = {
    success: { Icon: CheckCircle, color: 'text-green-500' },
    error: { Icon: XCircle, color: 'text-red-500' },
    loading: { Icon: Loader2, color: '' },
};

export function StatusDisplay({ status, message }: StatusDisplayProps) {
    const { Icon, color } = statusConfig[status];
    const animation = status === 'loading' ? 'animate-spin' : '';

    return (
        <div className="space-y-4">
            <Icon className={`h-16 w-16 ${color} mx-auto ${animation}`} />
            <p className="text-gray-600">{message}</p>
        </div>
    );
}