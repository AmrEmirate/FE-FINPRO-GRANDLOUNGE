// src/hooks/use-email-verification.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiHelper from "@/lib/apiHelper";
import { useToast } from "@/hooks/use-toast";

type VerificationStatus = "pending" | "success" | "expired" | "invalid";

export function useEmailVerification(token: string | null) {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<VerificationStatus>("pending");

    useEffect(() => {
        if (!token) setStatus("invalid");
    }, [token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTogglePassword = (field: "password" | "confirmPassword") => {
        if (field === "password") setShowPassword((s) => !s);
        else setShowConfirmPassword((s) => !s);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validasi dipindahkan ke fungsi terpisah agar handleSubmit lebih bersih
        if (!validatePassword()) return;

        setIsLoading(true);
        try {
            await apiHelper.post("/auth/verify", { token, password: formData.password });
            setStatus("success");
            toast({ title: "Success", description: "Account verified! Redirecting..." });
            setTimeout(() => router.push("/auth/login"), 2000);
        } catch (error: any) {
            handleVerificationError(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fungsi helper untuk validasi
    const validatePassword = (): boolean => {
        if (formData.password !== formData.confirmPassword) {
            toast({ variant: "destructive", description: "Passwords do not match." });
            return false;
        }
        if (formData.password.length < 8) {
            toast({ variant: "destructive", description: "Password must be at least 8 characters." });
            return false;
        }
        return true;
    }

    // Fungsi helper untuk menangani error
    const handleVerificationError = (error: any) => {
        const message = error.response?.data?.message || "Invalid or expired token.";
        toast({ variant: "destructive", title: "Verification Failed", description: message });
        setStatus(message.toLowerCase().includes("expired") ? "expired" : "invalid");
    }

    const handleResendVerification = async () => {
        toast({ title: "Info", description: "Resend verification feature is not yet available." });
    };

    return {
        status,
        formData,
        isLoading,
        showPassword,
        showConfirmPassword,
        handleInputChange,
        handleSubmit,
        handleTogglePassword,
        handleResendVerification
    };
}