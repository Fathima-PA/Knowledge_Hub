
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const splitTextIntoChunks = async (text) => {
  // Configure the text splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100
  });

  // Split the text into chunks
  const chunks = await splitter.splitText(text);

  return chunks;
};
