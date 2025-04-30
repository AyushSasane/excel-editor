"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ObservationsStepProps {
  observations: string[]
  handleObservationChange: (index: number, value: string) => void
}

export function ObservationsStep({ observations, handleObservationChange }: ObservationsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center md:text-left">Observations</h2>
        <p className="text-sm text-muted-foreground text-center md:text-left">
          Enter your observations for cells E7-E11
        </p>
      </div>

      <div className="space-y-4">
        {observations.map((observation, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`observation-${index}`}>
              Observation {index + 1} (Cell E{7 + index})
            </Label>
            <Textarea
              id={`observation-${index}`}
              value={observation}
              onChange={(e) => handleObservationChange(index, e.target.value)}
              placeholder={`Enter observation ${index + 1}`}
              className="min-h-[80px] w-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
