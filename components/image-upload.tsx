"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface ImageUploadProps {
  onImageChange: (file: File | null) => void
}

export default function ImageUpload({ onImageChange }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setSelectedImage(file)
      onImageChange(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedImage(null)
      onImageChange(null)
      setPreview(null)
    }
  }

  return (
    <div>
      <input type="file" id="image-upload" accept="image/*" className="hidden" onChange={handleImageChange} />
      <label htmlFor="image-upload">
        <Button variant="outline" asChild>
          <div className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            {selectedImage ? "Change Image" : "Upload Image"}
          </div>
        </Button>
      </label>
      {preview && (
        <div className="mt-2">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="max-w-full h-auto rounded-md" />
        </div>
      )}
    </div>
  )
}
