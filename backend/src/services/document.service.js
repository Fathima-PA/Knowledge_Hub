
import fs from "fs/promises";
import pdf from "pdf-parse/lib/pdf-parse.js";

export const extractText = async (file) => {
  try {
    let extractedText = "";

    // Extract text from PDF
    if (file.mimetype === "application/pdf") {
      const fileBuffer = await fs.readFile(file.path);

      const pdfData = await pdf(fileBuffer);

      extractedText = pdfData.text;
    }

    // Extract text from TXT
    else if (file.mimetype === "text/plain") {
      extractedText = await fs.readFile(
        file.path,
        "utf-8"
      );
    }

    else {
      throw new Error("Unsupported document format");
    }

    return {
      text: extractedText.trim(),
      totalCharacters: extractedText.trim().length
    };

  } catch (error) {
    throw new Error(`Text extraction failed: ${error.message}`);
  }
};
