import ExcelJS from "exceljs"
import { readFile } from "fs/promises"
import { join } from "path"
import sharp from "sharp"
import { existsSync } from "fs"

interface ExcelProcessingData {
  date: string
  tankSerialNo: string
  themeColor: string
  observations: string[]
  imagePaths: (string | null)[]
  outputPath: string
}

export class ExcelProcessor {
  private async getTemplatePath(): Promise<string> {
    // Try to find the template in various locations
    const possiblePaths = [
      join(process.cwd(), "templates", "template.xlsx"),
      join(process.cwd(), "public", "templates", "template.xlsx"),
      join(process.cwd(), "backend", "templates", "template.xlsx"),
    ]

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        return path
      }
    }

    throw new Error("Could not find template.xlsx in any expected location")
  }

  private async loadWorkbook(): Promise<ExcelJS.Workbook> {
    const templatePath = await this.getTemplatePath()
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(templatePath)
    return workbook
  }

  private async processImage(imagePath: string): Promise<Buffer> {
    // Resize image to fit in Excel cell
    return await sharp(imagePath).resize(200, 200, { fit: "inside" }).toBuffer()
  }

  public async processExcel(data: ExcelProcessingData): Promise<void> {
    const workbook = await this.loadWorkbook()
    // const worksheet = workbook.getWorksheet(1)
    const worksheet = workbook.getWorksheet('C-1080');


    if (!worksheet) {
      throw new Error("Worksheet not found in template")
    }

    // Update text fields
    this.updateCellWithFormatting(worksheet, "B3", `Date: ${data.date}`)
    this.updateCellWithFormatting(worksheet, "B4", `Tank Sr No: ${data.tankSerialNo}`)
    this.updateCellWithFormatting(worksheet, "F4", `Theme: ${data.themeColor}`)

    // Update observations
    for (let i = 0; i < data.observations.length; i++) {
      this.updateCellWithFormatting(worksheet, `E${7 + i}`, data.observations[i])
    }

    // Add images
    const imageCells = ["F7", "G7", "F8", "G8", "F10", "G10"]
    for (let i = 0; i < data.imagePaths.length; i++) {
      const imagePath = data.imagePaths[i]
      if (imagePath) {
        try {
          const imageBuffer = await this.processImage(imagePath)
          const imageId = workbook.addImage({
            buffer: imageBuffer,
            extension: "jpeg",
          })

          worksheet.addImage(imageId, {
            tl: { col: this.getColIndex(imageCells[i]), row: this.getRowIndex(imageCells[i]) - 1 },
            ext: { width: 200, height: 200 },
          })
        } catch (error) {
          console.error(`Error processing image ${i + 1}:`, error)
        }
      }
    }

    // Save the workbook
    await workbook.xlsx.writeFile(data.outputPath)
  }

  private updateCellWithFormatting(worksheet: ExcelJS.Worksheet, cellAddress: string, value: string): void {
    const cell = worksheet.getCell(cellAddress)

    // Store original formatting
    const originalStyle = {
      font: { ...cell.font },
      border: { ...cell.border },
      fill: { ...cell.fill },
      numFmt: cell.numFmt,
      alignment: { ...cell.alignment },
      protection: { ...cell.protection },
    }

    // Update value
    cell.value = value

    // Restore formatting
    cell.font = originalStyle.font
    cell.border = originalStyle.border
    cell.fill = originalStyle.fill
    cell.numFmt = originalStyle.numFmt
    cell.alignment = originalStyle.alignment
    cell.protection = originalStyle.protection
  }

  private getColIndex(cellAddress: string): number {
    const colStr = cellAddress.replace(/[0-9]/g, "")
    let colIndex = 0
    for (let i = 0; i < colStr.length; i++) {
      colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 64)
    }
    return colIndex - 1 // 0-based index
  }

  private getRowIndex(cellAddress: string): number {
    return Number.parseInt(cellAddress.replace(/[A-Z]/g, ""))
  }

  public async getFileBuffer(filePath: string): Promise<Buffer> {
    return await readFile(filePath)
  }
}
