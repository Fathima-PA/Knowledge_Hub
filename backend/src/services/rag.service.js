
import { ChatOllama } from "@langchain/ollama";
import { searchDocuments } from "./search.service.js";

const chatModel = new ChatOllama({
  model: "llama3.2:1b",
  baseUrl: "http://localhost:11434",
  temperature: 0
});

export const generateAnswer = async (question) => {
  try {
    // 1. Retrieve relevant document chunks
    const results = await searchDocuments(question);

    if (results.length === 0) {
      return "I couldn't find relevant information in the uploaded documents.";
    }

    // 2. Prepare retrieved content as context
    const context = results
      .map((result) => result.content)
      .join("\n\n");

    // 3. Create the prompt
    const prompt = `
You are a helpful document assistant.

Answer the question using only the provided context.

If the answer is not available in the context,
say that you couldn't find the answer in the uploaded documents.

Context:
${context}

Question:
${question}

Answer:
`;

    // 4. Generate an answer using Ollama
    const response = await chatModel.invoke(prompt);

    return response.content;

  } catch (error) {
    throw new Error(`Answer generation failed: ${error.message}`);
  }
};
export const generateAnswerFromContext = async (question, context) => {
  try {
    const prompt = `
You are a helpful document assistant.

Answer the question using only the provided context.

If the answer is not available in the context,
say that you couldn't find the answer in the uploaded documents.

Context:
${context}

Question:
${question}

Answer:
`;

    const response = await chatModel.invoke(prompt);

    return response.content;

  } catch (error) {
    throw new Error(`Answer generation failed: ${error.message}`);
  }
};