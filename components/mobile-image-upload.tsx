"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface MobileImageUploadProps {
  onImageChange: (file: File | null) => void
  currentImage: File | null
}

export function MobileImageUpload({ onImageChange, currentImage }: MobileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false)

  useEffect(() => {
    if (currentImage) {
      const objectUrl = URL.createObjectURL(currentImage)
      setPreview(objectUrl)

      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [currentImage])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageChange(file)
    } else {
      setPreview(null)
      onImageChange(null)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const startCamera = async () => {
    try {
      setCameraError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
        audio: false,
      })

      setStream(mediaStream)
      setShowCamera(true)

      // Ensure video element is initialized with stream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setCameraError("Could not access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
    setCameraDialogOpen(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame to canvas
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a File object from the blob
              const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })

              // Create preview
              const reader = new FileReader()
              reader.onloadend = () => {
                setPreview(reader.result as string)
              }
              reader.readAsDataURL(file)

              // Pass file to parent
              onImageChange(file)

              // Stop camera
              stopCamera()
            }
          },
          "image/jpeg",
          0.9,
        )
      }
    }
  }

  // Clean up camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  // Initialize video when stream is set
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className="space-y-2">
      {preview ? (
        <Card className="relative overflow-hidden p-0">
          <div className="relative w-full h-40">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill style={{ objectFit: "cover" }} />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-5 w-5 text-emerald-600" />
            <span className="text-xs">Upload</span>
          </Button>

          <Dialog open={cameraDialogOpen} onOpenChange={setCameraDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => {
                  setCameraDialogOpen(true)
                  startCamera()
                }}
              >
                <Camera className="h-5 w-5 text-emerald-600" />
                <span className="text-xs">Camera</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 max-w-[350px] rounded-lg overflow-hidden">
              {showCamera ? (
                <div className="relative w-full">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-[350px] object-cover" />
                  <canvas ref={canvasRef} className="hidden" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-4 bg-black bg-opacity-50">
                    <Button type="button" variant="secondary" onClick={stopCamera} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      onClick={capturePhoto}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Capture
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <p>Camera initializing...</p>
                </div>
              )}
              {cameraError && (
                <div className="p-4 bg-red-50 text-red-500">
                  <p>{cameraError}</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  )
}
