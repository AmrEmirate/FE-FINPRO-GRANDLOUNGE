// src/hooks/use-registration.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/apiHelper";
import { useToast } from "@/hooks/use-toast";

type FormData = {
    fullName: string;
    email: string;
    companyName: string;
    addressCompany: string;
    phoneNumberCompany: string;
};

export function useRegistration(userType: string) {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        companyName: "",
        addressCompany: "",
        phoneNumberCompany: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const isTenant = userType === "tenant";
        const endpoint = isTenant ? "/auth/register/tenant" : "/auth/register/user";
        const payload = isTenant ? formData : { fullName: formData.fullName, email: formData.email };

        try {
            const response = await api.post(endpoint, payload);
            toast({ title: "Registrasi Berhasil", description: response.data.message });
            
            // Pengalihan berdasarkan userType
            if (isTenant) {
                router.push("/auth/login?type=tenant");
            } else {
                router.push("/auth/login?type=user");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Terjadi kesalahan.";
            toast({ variant: "destructive", title: "Registrasi Gagal", description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, isLoading, handleInputChange, handleSubmit };
}