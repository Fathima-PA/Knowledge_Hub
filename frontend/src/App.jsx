
import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");
const [asking, setAsking] = useState(false);
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a document first.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/documents/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      setMessage(result.message || "Document uploaded successfully!");
      setFile(null);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleAsk = async () => {
  if (!question.trim()) {
    setAnswer("Please enter a question.");
    return;
  }

  try {
    setAsking(true);
    setAnswer("");

    const response = await fetch(
      "http://localhost:5000/api/documents/ask",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to generate answer");
    }

    setAnswer(result.data.answer);

  } catch (error) {
    setAnswer(error.message);
  } finally {
    setAsking(false);
  }
};

  return (
    <div className="app">
      <header className="header">
        <h1>KnowledgeHub</h1>
        <p>AI Document Assistant</p>
      </header>

      <main className="container">
        <section className="section">
          <h2>Upload Documents</h2>

          <div className="upload-box">
            <div className="upload-icon">📄</div>

            <h3>Upload your document</h3>
            <p>Choose a PDF or TXT file</p>

            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => {
                setFile(e.target.files[0] || null);
                setMessage("");
              }}
            />

            {file && <p>Selected: {file.name}</p>}

            <button
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>

            {message && <p>{message}</p>}
          </div>
        </section>
        <section className="section">
  <h2>Ask Your Document</h2>

  <textarea
    placeholder="Ask something about your document..."
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
  />

  <button
    className="ask-button"
    onClick={handleAsk}
    disabled={asking}
  >
    {asking ? "Generating Answer..." : "Ask Question"}
  </button>

  {answer && (
    <div className="answer-box">
      <h3>AI Answer</h3>
      <p>{answer}</p>
    </div>
  )}
</section>
      </main>
    </div>
  );
}

export default App;