"use client"

import { ModeToggle } from "@/components/mode-toggle"

interface MobileHeaderProps {
  currentStep: number
  totalSteps: number
}

export function MobileHeader({ currentStep, totalSteps }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Removed hamburger menu */}
          <h1 className="text-lg font-semibold">Excel Editor</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center text-sm text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <ModeToggle />
        </div>
      </div>
      <div
        className="md:hidden h-1 bg-gradient-to-r from-emerald-500 to-emerald-700"
        style={{
          width: `${((currentStep + 1) / totalSteps) * 100}%`,
          transition: "width 0.3s ease-in-out",
        }}
      />
    </header>
  )
}
