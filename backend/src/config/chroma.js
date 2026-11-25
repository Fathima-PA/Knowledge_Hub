
import { ChromaClient } from "chromadb";

const chromaClient = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false
});

export const checkChromaConnection = async () => {
  try {
    const heartbeat = await chromaClient.heartbeat();

    console.log("ChromaDB connected successfully");

    return heartbeat;
  } catch (error) {
    throw new Error(`ChromaDB connection failed: ${error.message}`);
  }
};

export default chromaClient;
