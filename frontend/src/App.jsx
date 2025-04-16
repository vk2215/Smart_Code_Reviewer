import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/components/prism-python";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import axios from "axios";

function App() {
  const [code, setCode] = useState(`def sum():\n  return a + b`);
  const [review, setReview] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    const response = await axios.post("http://localhost:3000/ai/get-review/", {
      code,
    });
    setReview(response.data);
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 gap-6">
      {/* Header */}
      <header className="w-full text-center py-4 text-3xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-lg rounded-lg">
        AI Code Reviewer
      </header>

      <div className="flex flex-row gap-6 w-full max-w-6xl">
        {/* Code Editor Panel */}
        <div className="w-1/2 h-full bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 overflow-auto">
          <input
            type="file"
            accept=".js, .py, .css, .cpp, .cs, .ts, .html, .json, .java"
            onChange={handleFileUpload}
            className="mb-4 text-sm text-yellow-200 cursor-pointer bg-gray-700 p-2 rounded-lg border border-gray-600"
          />

          <div className="border border-gray-600 rounded-lg p-4" style={{ backgroundColor: "#1e293b" }}>
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.python, "python")
              }
              padding={10}
              style={{
                fontFamily: "Fira Code, monospace",
                fontSize: 16,
                backgroundColor: "#1e293b", // slate-800 like
                color: "#fef3c7", // light yellow
                minHeight: "300px",
              }}
            />
          </div>

          <button
            onClick={reviewCode}
            className="w-full mt-4 py-3 text-lg font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-amber-600 hover:to-rose-600 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            Review Code
          </button>
        </div>

        {/* Review Output Panel */}
        <div className="w-1/2 h-full bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 overflow-auto">
          <div className="prose max-w-none prose-pre:bg-gray-900 prose-pre:text-amber-200 prose-code:text-amber-200 text-yellow-100">
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

