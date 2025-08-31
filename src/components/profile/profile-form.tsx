"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"
import apiHelper from "@/lib/apiHelper"

// Skema validasi HANYA untuk fullName
const profileFormSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  // Gunakan 'login' untuk memperbarui state setelah berhasil
  const { user, login } = useAuth() 
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // Perbaikan: Gunakan user.profilePicture
  const [preview, setPreview] = useState<string | null>(user?.profilePicture || null) 
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    // Hapus phoneNumber
    defaultValues: {
      fullName: user?.fullName || "",
    },
  })

  // Set nilai form saat data user berubah
  useEffect(() => {
    if (user) {
        form.reset({ fullName: user.fullName });
        setPreview(user.profilePicture || null);
    }
  }, [user, form]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      toast({ variant: "destructive", title: "Invalid File Type", description: "Please select a JPG, PNG, or GIF image."})
      return
    }

    const maxSizeInBytes = 1 * 1024 * 1024 
    if (file.size > maxSizeInBytes) {
      toast({ variant: "destructive", title: "File Too Large", description: "The maximum file size is 1MB."})
      return
    }

    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  // Fungsi onSubmit yang memanggil API secara langsung
  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    // Gunakan FormData untuk mengirim file dan data teks
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    if (selectedFile) {
      formData.append('profilePicture', selectedFile);
    }

    try {
      const response = await apiHelper.patch('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = response.data.data;
      const token = localStorage.getItem('authToken');

      if (token) {
        // Perbarui state global dan localStorage dengan data baru
        login(token, updatedUser);
      }
      
      toast({ title: "Success", description: "Your profile has been updated." })
    } catch (error: any) {
      toast({ 
          variant: "destructive", 
          title: "Update Failed", 
          description: error.response?.data?.message || "Could not update your profile." 
      })
    } finally {
        setIsLoading(false)
    }
  }

  if (!user) return <p>Loading profile...</p>

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            {/* Perbaikan: Gunakan 'preview' untuk menampilkan gambar */}
            <AvatarImage src={preview || "/placeholder-user.jpg"} alt={user.fullName} />
            <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
            <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
                </FormControl>
                <FormMessage />
            </FormItem>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}