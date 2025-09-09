declare module "pdf-parse/lib/pdf-parse.js" {
  import { Buffer } from "buffer";

  export interface PDFInfo {
    PDFFormatVersion?: string;
    IsAcroFormPresent?: boolean;
    IsXFAPresent?: boolean;
    [key: string]: string | number | boolean | undefined;
  }

  export interface PDFMetadata {
    info: PDFInfo;
    metadata?: Record<string, unknown>;
    version?: string;
  }

  export interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata: Record<string, unknown> | null;
    version: string;
  }

  /**
   * Parse a PDF buffer into text and metadata
   * @param dataBuffer Buffer containing the PDF file
   * @param options Optional configuration
   */
  export default function pdf(
    dataBuffer: Buffer,
    options?: Record<string, unknown>
  ): Promise<PDFData>;
}
