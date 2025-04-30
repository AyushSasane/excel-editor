"use client"

import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileImageUpload } from "@/components/mobile-image-upload"

interface ImagesStepProps {
  images: File[]
  handleImageChange: (index: number, file: File | null) => void
}

export function ImagesStep({ images, handleImageChange }: ImagesStepProps) {
  // Define the cell locations for each image
  const imageCells = ["F7", "G7", "F8", "G8", "F10", "G10"]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center md:text-left">Images</h2>
        <p className="text-sm text-muted-foreground text-center md:text-left">
          Upload or capture images for your Excel document
        </p>
      </div>

      <Tabs defaultValue="tab1" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="tab1">Images 1-2</TabsTrigger>
          <TabsTrigger value="tab2">Images 3-4</TabsTrigger>
          <TabsTrigger value="tab3">Images 5-6</TabsTrigger>
        </TabsList>

        <TabsContent value="tab1" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image 1 (Cell {imageCells[0]})</Label>
              <MobileImageUpload onImageChange={(file) => handleImageChange(0, file)} currentImage={images[0]} />
            </div>

            <div className="space-y-2">
              <Label>Image 2 (Cell {imageCells[1]})</Label>
              <MobileImageUpload onImageChange={(file) => handleImageChange(1, file)} currentImage={images[1]} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tab2" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image 3 (Cell {imageCells[2]})</Label>
              <MobileImageUpload onImageChange={(file) => handleImageChange(2, file)} currentImage={images[2]} />
            </div>

            <div className="space-y-2">
              <Label>Image 4 (Cell {imageCells[3]})</Label>
              <MobileImageUpload onImageChange={(file) => handleImageChange(3, file)} currentImage={images[3]} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tab3" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image 5 (Cell {imageCells[4]})</Label>
              <MobileImageUpload onImageChange={(file) => handleImageChange(4, file)} currentImage={images[4]} />
            </div>

            <div className="space-y-2">
              <Label>Image 6 (Cell {imageCells[5]})</Label>
              <MobileImageUpload onImageChange={(file) => handleImageChange(5, file)} currentImage={images[5]} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
