// src/types/jspdf-autotable.d.ts
import "jspdf"

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number
    }
  }
}

declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf"

  export interface AutoTableOptions {
    head?: any[][]
    body: any[][]
    theme?: "striped" | "grid" | "plain"
    startY?: number
    styles?: any
  }

  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void
}
