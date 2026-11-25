
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { searchDocuments } from "./search.service.js";
import { generateAnswerFromContext } from "./rag.service.js";
const KnowledgeHubState = Annotation.Root({
  question: Annotation(),
  documents: Annotation(),
  answer: Annotation()
});
const retrieveDocuments = async (state) => {
  console.log("Retrieving relevant documents...");

  const results = await searchDocuments(state.question);

  return {
    documents: results
  };
};
const generateAnswer = async (state) => {
  console.log("Generating answer...");

  const context = state.documents
    .map((document) => document.content)
    .join("\n\n");

  const answer = await generateAnswerFromContext(
    state.question,
    context
  );

  return {
    answer
  };
};
const workflow = new StateGraph(KnowledgeHubState)
  .addNode("retrieve", retrieveDocuments)
  .addNode("generate", generateAnswer)
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", END);

export const knowledgeHubGraph = workflow.compile();