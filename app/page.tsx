import ExcelEditor from "@/components/excel-editor"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ExcelEditor />
    </ThemeProvider>
  )
}
