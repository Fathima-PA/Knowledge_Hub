
import { OllamaEmbeddings } from "@langchain/ollama";

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434"
});

export const generateEmbeddings = async (chunks) => {
  try {
    const vectors = await embeddings.embedDocuments(chunks);

    return vectors;
  } catch (error) {
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};
export const generateQueryEmbedding = async (question) => {
  try {
    const vector = await embeddings.embedQuery(question);
    return vector;
  } catch (error) {
    throw new Error(`Query embedding generation failed: ${error.message}`);
  }
};