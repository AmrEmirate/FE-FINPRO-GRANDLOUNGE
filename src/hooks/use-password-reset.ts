// src/hooks/use-password-reset.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiHelper from "@/lib/apiHelper";
import { useToast } from "@/hooks/use-toast";

export function usePasswordReset(token: string | null) {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTogglePassword = (field: "password" | "confirmPassword") => {
        if (field === "password") setShowPassword((s) => !s);
        else setShowConfirmPassword((s) => !s);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast({ variant: "destructive", description: "Passwords do not match." });
            return;
        }
        if (!token) {
            toast({ variant: "destructive", description: "Invalid reset link." });
            return;
        }
        setIsLoading(true);
        try {
            await apiHelper.post("/auth/password-reset/confirm", { token, password: formData.password });
            toast({ title: "Success", description: "Password has been reset. Please log in." });
            router.push("/auth/login");
        } catch (error: any) {
            const message = error.response?.data?.message || "Invalid or expired token.";
            toast({ variant: "destructive", title: "Reset Failed", description: message });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        showPassword,
        showConfirmPassword,
        handleInputChange,
        handleSubmit,
        handleTogglePassword,
    };
}