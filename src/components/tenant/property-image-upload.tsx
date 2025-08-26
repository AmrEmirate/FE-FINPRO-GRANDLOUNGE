"use client"

import { Button } from "@/src/components/ui/button"
import { Upload } from "lucide-react"

export function PropertyImageUpload() {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Property Images</h3>
      <p className="text-gray-600 mb-4">Drag and drop your images here, or click to browse</p>
      <Button type="button" variant="outline">
        Choose Files
      </Button>
    </div>
  )
}
