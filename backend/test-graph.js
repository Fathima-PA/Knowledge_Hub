
import { knowledgeHubGraph } from "./src/services/rag.graph.js";

const result = await knowledgeHubGraph.invoke({
  question: "What is Node.js?"
});

console.log("\nFinal Answer:");
console.log(result.answer);
