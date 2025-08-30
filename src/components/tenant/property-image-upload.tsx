"use client"

import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"

// Tipe data untuk bagian form yang dikelola oleh komponen ini
interface ImageData {
  mainImage: File | null;
}

// Definisikan props yang diterima oleh komponen
interface PropertyImageUploadProps {
  formData: ImageData;
  updateFormData: (updates: Partial<ImageData>) => void;
}

export function PropertyImageUpload({ formData, updateFormData }: PropertyImageUploadProps) {
  // Fungsi untuk menangani perubahan saat pengguna memilih file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Perbarui state di komponen induk dengan file yang baru dipilih
      updateFormData({ mainImage: file })
    }
  }

  return (
    <div>
      {/* Area untuk upload file, berfungsi sebagai label untuk input file */}
      <label
        htmlFor="image-upload"
        className="relative block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Main Image</h3>
        <p className="text-gray-600 mb-4">Drag and drop your image here, or click to browse</p>
        <Button type="button" variant="outline">
          Choose File
        </Button>
        {/* Input file yang sebenarnya disembunyikan */}
        <input 
          id="image-upload" 
          type="file" 
          className="hidden" 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/jpg" 
        />
      </label>

      {/* Bagian untuk menampilkan preview gambar jika sudah dipilih */}
      {formData.mainImage && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Image Preview:</h4>
          <div className="relative w-48 h-32 rounded-lg overflow-hidden border">
            <Image
              src={URL.createObjectURL(formData.mainImage)}
              alt="Preview of the uploaded main image"
              fill
              className="object-cover"
            />
            {/* Tombol untuk menghapus gambar yang sudah dipilih */}
            <button
              type="button"
              title="Remove image" // PERBAIKAN: Menambahkan title untuk aksesibilitas
              onClick={() => updateFormData({ mainImage: null })}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}