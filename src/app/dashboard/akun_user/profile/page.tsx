"use client";

import { ProfileTabs } from "@/components/profile/profile-tabs";

// Komponen utama halaman profil
export default function ProfilePage() {
  /*
    * PENJELASAN:
    * Halaman ini sekarang menjadi sangat sederhana. Tugasnya hanya satu:
    * 1. Menampilkan komponen <ProfileTabs />.
    *
    * Semua logika, pengambilan data (dari useAuth), dan pengelolaan state (useState)
    * yang sebelumnya ada di sini telah dipindahkan ke dalam komponen-komponen 
    * yang lebih spesifik seperti <ProfileTabs />, <ProfileForm />, dan <SecurityForm />.
    *
    * Pendekatan ini disebut "Component-Based Architecture" dan ini adalah cara
    * yang benar untuk membangun aplikasi dengan Next.js dan React untuk menghindari
    * error "Unhandled Runtime Error" yang disebabkan oleh masalah passing props
    * atau state management yang rumit di level halaman.
    */
  return <ProfileTabs />;
}