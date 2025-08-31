"use client"

import type { ReactElement } from "react"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { useAuth } from "@/context/AuthContext"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "@/hooks/use-toast"

function ProfileContent(): ReactElement {
    const { user, login } = useAuth()
    const { toast } = useToast()

    // State untuk semua form di halaman profil
    const [profileData, setProfileData] = useState({ fullName: "", email: "" });
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [notifications, setNotifications] = useState({ emailUpdates: true, emailPromotions: false, pushNotifications: true });
    const [isLoading, setIsLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // Mengisi form dengan data pengguna saat komponen dimuat
    useEffect(() => {
        if (user) {
            setProfileData({
                fullName: user.fullName,
                email: user.email,
            });
        }
    }, [user]);

    // Tampilkan loading jika data pengguna belum siap
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    // Handler untuk memperbarui profil (nama & foto)
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Cek apakah email diubah
        if (profileData.email !== user.email) {
            try {
                await apiHelper.post('/user/email/request-change', { newEmail: profileData.email });
                toast({
                    title: "Periksa Email Baru Anda",
                    description: `Kami telah mengirimkan tautan verifikasi ke ${profileData.email}.`,
                });
                setProfileData(prev => ({ ...prev, email: user.email }));
            } catch (error: any) {
                toast({ variant: "destructive", title: "Gagal Mengubah Email", description: error.response?.data?.message || "Terjadi kesalahan." });
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // Jika email tidak berubah, lanjutkan update profil biasa
        const formData = new FormData();
        formData.append('fullName', profileData.fullName);
        if (avatarFile) {
            formData.append('profilePicture', avatarFile);
        }

        try {
            const response = await apiHelper.patch('/user/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            login(localStorage.getItem('authToken')!, response.data.data);
            toast({ title: "Sukses", description: "Profil berhasil diperbarui." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Update Gagal", description: error.response?.data?.message || "Terjadi kesalahan." });
        } finally {
            setIsLoading(false);
            setAvatarFile(null);
        }
    };

    // Handler untuk mengganti password
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({ variant: "destructive", title: "Error", description: "Password baru tidak cocok." });
            return;
        }
        setIsLoading(true);
        try {
            await apiHelper.patch('/user/password', {
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast({ title: "Sukses", description: "Password berhasil diubah." });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Update Gagal", description: error.response?.data?.message || "Terjadi kesalahan." });
        } finally {
            setIsLoading(false);
        }
    };

    // Handler untuk memilih file avatar
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast({ variant: "destructive", title: "Error", description: "Ukuran file tidak boleh lebih dari 1MB." });
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                toast({ variant: "destructive", title: "Error", description: "Tipe file tidak valid. Hanya JPG, PNG, GIF." });
                return;
            }
            setAvatarFile(file);
            toast({ title: "Info", description: "Gambar dipilih. Klik 'Update Profile' untuk menyimpan." });
        }
    };

    const handleTogglePassword = (field: "current" | "new" | "confirm") => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleEmailVerification = () => toast({ title: "Info", description: "Mengirim ulang email verifikasi..." });
    const handleNotificationSave = () => toast({ title: "Sukses", description: "Preferensi notifikasi disimpan." });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                </div>

                <ProfileTabs
                    profileData={profileData}
                    passwordData={passwordData}
                    showPasswords={showPasswords}
                    notifications={notifications}
                    isLoading={isLoading}
                    onProfileUpdate={handleProfileUpdate}
                    onPasswordChange={handlePasswordChange}
                    onAvatarUpload={handleAvatarUpload}
                    onEmailVerification={handleEmailVerification}
                    onNotificationSave={handleNotificationSave}
                    onProfileDataChange={setProfileData}
                    onPasswordDataChange={setPasswordData}
                    onNotificationsChange={setNotifications}
                    onTogglePassword={handleTogglePassword}
                />
            </div>
        </div>
    );
}

// Komponen utama yang membungkus konten dengan proteksi rute
export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    )
}

