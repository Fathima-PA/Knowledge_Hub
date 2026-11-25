
import chromaClient from "../config/chroma.js";
import { generateQueryEmbedding } from "./embedding.service.js";

const COLLECTION_NAME = "knowledgehub_documents";

export const searchDocuments = async (question) => {
  try {
    // 1. Convert the question into an embedding
    const queryEmbedding = await generateQueryEmbedding(question);

    // 2. Get the existing ChromaDB collection
    const collection = await chromaClient.getCollection({
  name: COLLECTION_NAME,
  embeddingFunction: null
});

    // 3. Search for the 3 most relevant chunks
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 3
    });

    // 4. Format the search results
    const documents = results.documents?.[0] || [];
    const distances = results.distances?.[0] || [];
    const ids = results.ids?.[0] || [];

    return documents.map((document, index) => ({
      id: ids[index],
      content: document,
      distance: distances[index]
    }));

  } catch (error) {
    throw new Error(`Document search failed: ${error.message}`);
  }
};
