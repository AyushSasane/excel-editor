import { type NextRequest, NextResponse } from "next/server"
import { ExcelProcessor } from "@/lib/excel-processor"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { existsSync } from "fs"
import { tmpdir } from "os"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form data
    const date = formData.get("date") as string
    const tankSerialNo = formData.get("tank_serial_no") as string
    const themeColor = formData.get("theme_color") as string

    // Extract observations
    const observations = []
    for (let i = 1; i <= 5; i++) {
      observations.push((formData.get(`observation_${i}`) as string) || "")
    }

    // Create temp directory for this session
    const sessionId = uuidv4()
    const sessionDir = join(tmpdir(), "excel-editor", sessionId)

    if (!existsSync(sessionDir)) {
      await mkdir(sessionDir, { recursive: true })
    }

    // Process images
    const imagePaths = []
    for (let i = 1; i <= 6; i++) {
      const image = formData.get(`image_${i}`) as File

      if (image) {
        const buffer = Buffer.from(await image.arrayBuffer())
        const imagePath = join(sessionDir, `image_${i}.jpg`)
        await writeFile(imagePath, buffer)
        imagePaths.push(imagePath)
      } else {
        imagePaths.push(null)
      }
    }

    // Process Excel
    const excelProcessor = new ExcelProcessor()
    const outputPath = join(sessionDir, "updated_excel.xlsx")

    await excelProcessor.processExcel({
      date,
      tankSerialNo,
      themeColor,
      observations,
      imagePaths,
      outputPath,
    })

    // Read the file and return it
    const fileBuffer = await excelProcessor.getFileBuffer(outputPath)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="updated_excel.xlsx"',
      },
    })
  } catch (error) {
    console.error("Error processing Excel:", error)
    return NextResponse.json({ error: "Failed to process Excel file" }, { status: 500 })
  }
}
