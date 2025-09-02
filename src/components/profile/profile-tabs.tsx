"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileHeader } from "./profile-header";
import { ProfileForm } from "./profile-form";
import { SecurityForm } from "./security-form";
import { VerificationStatus } from "./verification-status";

// Komponen ini menjadi lebih sederhana dan tidak lagi mengelola state
export function ProfileTabs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Profil</h1>
        <p className="text-gray-600 mt-1">Kelola informasi akun dan preferensi Anda</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
          <TabsTrigger value="verification">Verifikasi</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>Perbarui data personal dan foto profil Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProfileHeader />
              <Separator />
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Keamanan</CardTitle>
              <CardDescription>Kelola password dan preferensi keamanan Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verifikasi Akun</CardTitle>
              <CardDescription>Verifikasi email Anda untuk keamanan tambahan.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* PERBAIKAN: Komponen ini sekarang dipanggil tanpa props */}
              <VerificationStatus />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}