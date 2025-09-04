'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { UploadCloud, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  maxFiles?: number
}

export function ImageUpload({ files, onFilesChange, maxFiles = 1 }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
      onFilesChange(newFiles)
    },
    [files, onFilesChange, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: maxFiles > 1,
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onFilesChange(newFiles)
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer',
          isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-10 h-10 text-gray-500" />
        <p className="mt-2 text-sm text-gray-500">
          Drag & drop files here, or click to select
        </p>
        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                fill
                className="object-cover rounded-md"
                onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
              />
              {/* --- PERBAIKAN DI SINI --- */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Remove image" // Label untuk aksesibilitas
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}