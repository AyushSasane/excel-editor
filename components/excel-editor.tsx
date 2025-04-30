"use client"

import { useState } from "react"
import { format } from "date-fns"

// UI Components
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { StepWizard } from "@/components/step-wizard"
import { MobileHeader } from "@/components/mobile-header"

// Step Components
import { BasicInfoStep } from "@/components/steps/basic-info-step"
import { ObservationsStep } from "@/components/steps/observations-step"
import { ImagesStep } from "@/components/steps/images-step"
import { ReviewStep } from "@/components/steps/review-step"

export default function ExcelEditor() {
  // Form state
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [tankSerialNo, setTankSerialNo] = useState("")
  const [themeColor, setThemeColor] = useState("")
  const [observations, setObservations] = useState(["", "", "", "", ""])
  const [images, setImages] = useState<File[]>(Array(6).fill(null))
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleObservationChange = (index: number, value: string) => {
    const newObservations = [...observations]
    newObservations[index] = value
    setObservations(newObservations)
  }

  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...images]
    newImages[index] = file
    setImages(newImages)
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("date", date ? format(date, "yyyy-MM-dd") : "")
      formData.append("tank_serial_no", tankSerialNo)
      formData.append("theme_color", themeColor)

      observations.forEach((obs, index) => {
        formData.append(`observation_${index + 1}`, obs)
      })

      images.forEach((image, index) => {
        if (image) {
          formData.append(`image_${index + 1}`, image)
        }
      })

      const response = await fetch("/api/process-excel", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process Excel file")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "updated_excel.xlsx"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success!",
        description: "Excel file has been processed and downloaded.",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to process Excel file. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      title: "Basic Info",
      component: (
        <BasicInfoStep
          date={date}
          setDate={setDate}
          tankSerialNo={tankSerialNo}
          setTankSerialNo={setTankSerialNo}
          themeColor={themeColor}
          setThemeColor={setThemeColor}
        />
      ),
    },
    {
      title: "Observations",
      component: (
        <ObservationsStep 
          observations={observations} 
          handleObservationChange={handleObservationChange} 
        />
      ),
    },
    {
      title: "Images",
      component: (
        <ImagesStep 
          images={images} 
          handleImageChange={handleImageChange} 
        />
      ),
    },
    {
      title: "Review",
      component: (
        <ReviewStep
          date={date}
          tankSerialNo={tankSerialNo}
          themeColor={themeColor}
          observations={observations}
          images={images}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobileHeader currentStep={currentStep} totalSteps={steps.length} />

      <main className="flex-1 container max-w-md mx-auto px-4 py-6 md:py-10">
        <StepWizard 
          steps={steps} 
          currentStep={currentStep} 
          setCurrentStep={setCurrentStep} 
        />
      </main>
      <Toaster />
    </div>
  )
}