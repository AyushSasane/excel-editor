"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ObservationsStepProps {
  observations: string[]
  handleObservationChange: (index: number, value: string) => void
}

const observationLabels = [
  "Blasting (Surface roughness SA 2 ½)",
  "Primer (External Avg. DFT: 40 to 50 µ)",
  "Primer (Internal Avg. DFT: 70 to 80 µ)",
  "Painting (External Avg. DFT: 90 to 120 µ)",
  "Painting (Internal Avg. DFT: 150 to 180 µ)"
]

export function ObservationsStep({ observations, handleObservationChange }: ObservationsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center md:text-left">Observations</h2>
        <p className="text-sm text-muted-foreground text-center md:text-left">
          Enter your observations for the following parameters
        </p>
      </div>

      <div className="space-y-4">
        {observationLabels.map((label, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`observation-${index}`}>
              {label}
            </Label>
            <Textarea
              id={`observation-${index}`}
              value={observations[index] || ''}
              onChange={(e) => handleObservationChange(index, e.target.value)}
              placeholder={`Enter observation for ${label}`}
              className="min-h-[80px] w-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
