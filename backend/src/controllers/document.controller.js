
import { extractText } from "../services/document.service.js";
import { splitTextIntoChunks } from "../services/chunk.service.js";
import { generateEmbeddings } from "../services/embedding.service.js";
import { storeDocumentVectors } from "../services/vector.service.js";
import { searchDocuments } from "../services/search.service.js";
import { knowledgeHubGraph } from "../services/rag.graph.js";
export const uploadDocument = (req, res) => {
  try {
    // Check whether a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document"
      });
    }

    // Send upload success response
    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Document upload failed",
      error: error.message
    });
  }
};

export const extractDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document"
      });
    }

    const result = await extractText(req.file);

    return res.status(200).json({
      success: true,
      message: "Document text extracted successfully",
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const chunkDocument = async (req, res) => {
  try {
    // Check whether a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document"
      });
    }

    // Extract text from the uploaded document
    const result = await extractText(req.file);

    // Split extracted text into chunks
    const chunks = await splitTextIntoChunks(result.text);

    // Send chunking response
    return res.status(200).json({
      success: true,
      message: "Document split into chunks successfully",
      data: {
        totalCharacters: result.totalCharacters,
        totalChunks: chunks.length,
        chunks: chunks
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const embedDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document"
      });
    }

    // 1. Extract text from the uploaded document
    const result = await extractText(req.file);

    // 2. Split extracted text into chunks
    const chunks = await splitTextIntoChunks(result.text);

    if (chunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No text found in the document"
      });
    }

    // 3. Generate embeddings using Ollama
    const vectors = await generateEmbeddings(chunks);

    // 4. Return embedding information
    return res.status(200).json({
      success: true,
      message: "Embeddings generated successfully",
      data: {
        totalChunks: chunks.length,
        totalVectors: vectors.length,
        vectorDimension: vectors[0].length,
        sampleVector: vectors[0].slice(0, 5)
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const storeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document"
      });
    }

    // 1. Extract text
    const result = await extractText(req.file);

    // 2. Split text into chunks
    const chunks = await splitTextIntoChunks(result.text);

    if (chunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No text found in the document"
      });
    }

    // 3. Generate embeddings
    const vectors = await generateEmbeddings(chunks);

    // 4. Store chunks and embeddings in ChromaDB
    const storageResult = await storeDocumentVectors(chunks, vectors);

    return res.status(201).json({
      success: true,
      message: "Document embeddings stored successfully",
      data: {
        totalChunks: chunks.length,
        totalVectors: vectors.length,
        vectorDimension: vectors[0].length,
        ...storageResult
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const searchDocument = async (req, res) => {
  try {
    const { question } = req.body;

    // Validate the question
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question"
      });
    }

    // Search relevant document chunks
    const results = await searchDocuments(question);

    return res.status(200).json({
      success: true,
      message: "Document search completed successfully",
      data: {
        question,
        totalResults: results.length,
        results
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required"
      });
    }

    const result = await knowledgeHubGraph.invoke({
      question
    });

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully",
      data: {
        question,
        answer: result.answer
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
