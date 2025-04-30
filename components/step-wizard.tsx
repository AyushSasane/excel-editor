"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Step {
  title: string
  component: React.ReactNode
}

interface StepWizardProps {
  steps: Step[]
  currentStep: number
  setCurrentStep: (step: number) => void
}

export function StepWizard({ steps, currentStep, setCurrentStep }: StepWizardProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  return (
    <div className="space-y-6">
      <div className="hidden md:flex justify-between mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index <= currentStep ? "text-emerald-600" : "text-gray-400"
            } cursor-pointer`}
            onClick={() => setCurrentStep(index)}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                index <= currentStep ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm font-medium">{step.title}</span>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${index < currentStep ? "bg-emerald-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">{steps[currentStep].component}</CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handlePrevious} disabled={isFirstStep} className="w-full md:w-auto">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {!isLastStep && (
          <Button onClick={handleNext} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
