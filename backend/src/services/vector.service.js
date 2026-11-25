
import chromaClient from "../config/chroma.js";

const COLLECTION_NAME = "knowledgehub_documents";

export const getDocumentCollection = async () => {
  try {
    const collection = await chromaClient.getOrCreateCollection({
  name: COLLECTION_NAME,
  metadata: {
    description: "KnowledgeHub document embeddings"
  },
  embeddingFunction: null
});

    return collection;
  } catch (error) {
    throw new Error(`Collection creation failed: ${error.message}`);
  }
};

export const storeDocumentVectors = async (chunks, vectors) => {
  try {
    const collection = await getDocumentCollection();

    const ids = chunks.map((_, index) => `chunk-${Date.now()}-${index}`);

    await collection.add({
      ids,
      documents: chunks,
      embeddings: vectors
    });

    return {
      collectionName: COLLECTION_NAME,
      totalStored: ids.length
    };
  } catch (error) {
    throw new Error(`Vector storage failed: ${error.message}`);
  }
};