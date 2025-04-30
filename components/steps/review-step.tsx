"use client"

import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Download, X } from "lucide-react"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ReviewStepProps {
  date: Date | undefined
  tankSerialNo: string
  themeColor: string
  observations: string[]
  images: File[]
  handleSubmit: () => Promise<void>
  loading: boolean
}

const observationLabels = [
  "Blasting (Surface roughness SA 2 ½)",
  "Primer (External Avg. DFT: 40 to 50 µ)",
  "Primer (Internal Avg. DFT: 70 to 80 µ)",
  "Painting (External Avg. DFT: 90 to 120 µ)",
  "Painting (Internal Avg. DFT: 150 to 180 µ)"
]

export function ReviewStep({
  date,
  tankSerialNo,
  themeColor,
  observations,
  images,
  handleSubmit,
  loading,
}: ReviewStepProps) {
  const hasImages = images.some((img) => img !== null)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center md:text-left">Review & Submit</h2>
        <p className="text-sm text-muted-foreground text-center md:text-left">
          Review your information before generating the Excel file
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="basic-info">
          <AccordionTrigger>Basic Information</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Date:</span>
                <span>{date ? format(date, "PPP") : "Not set"}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Tank Serial Number:</span>
                <span>{tankSerialNo || "Not set"}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Theme Color:</span>
                <span>{themeColor || "Not set"}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="observations">
          <AccordionTrigger>Observations</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {observationLabels.map((label, index) => (
                <div key={index} className="flex justify-between py-1 border-b">
                  <span className="font-medium">{label}:</span>
                  <span className="text-right max-w-[60%] truncate">{observations[index] || "Not set"}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="images">
          <AccordionTrigger>Images</AccordionTrigger>
          <AccordionContent>
            {hasImages ? (
              <div className="grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="text-center">
                    {image ? (
                      <div className="relative h-20 w-full rounded overflow-hidden border">
                        <Image
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Image ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-full flex items-center justify-center bg-gray-100 rounded border">
                        <X className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <p className="text-xs mt-1">Image {index + 1}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-2">No images uploaded</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Download className="mr-2 h-5 w-5" />
              Generate & Download Excel
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
