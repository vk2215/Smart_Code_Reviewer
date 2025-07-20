import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/components/prism-python";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import axios from "axios";
import html2pdf from "html2pdf.js";

function App() {
  const [code, setCode] = useState(`def sum(a, b):\n  return a + b`);
  const [review, setReview] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [codeQuality, setCodeQuality] = useState(null);

  useEffect(() => {
    prism.highlightAll();
  }, [code, review]);

  async function reviewCode() {
    const response = await axios.post("http://localhost:3000/ai/get-review/", {
      code,
    });

    setReview(response.data);
    // Mock score for now
    const score = Math.floor(Math.random() * 100);
    setCodeQuality(score);
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

  function exportToPDF() {
    const element = document.getElementById("review-output");
    const opt = {
      margin: 0.5,
      filename: "code-review.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`flex flex-col items-center min-h-screen p-6 gap-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } transition-colors duration-300`}
    >
      {/* Header */}
      <header className="w-full text-center py-4 text-3xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-lg rounded-lg">
        AI Code Reviewer
      </header>

      {/* Dark Mode Toggle */}
      <div className="flex justify-between w-full max-w-6xl items-center">
        <input
          type="file"
          accept=".js, .py, .css, .cpp, .cs, .ts, .html, .json, .java"
          onChange={handleFileUpload}
          className="text-sm cursor-pointer bg-gray-700 text-yellow-200 p-2 rounded-lg border border-gray-600"
        />
        <button
          onClick={toggleDarkMode}
          className="bg-gray-700 text-yellow-200 px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="flex flex-row gap-6 w-full max-w-6xl">
        {/* Code Editor Panel */}
        <div className="w-1/2 h-[80vh] bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 overflow-auto">
          <div
            className="border border-gray-600 rounded-lg p-4"
            style={{ backgroundColor: "#1e293b" }}
          >
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
                backgroundColor: "#1e293b",
                color: "#fef3c7",
                minHeight: "60vh",
              }}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={reviewCode}
              className="flex-1 py-2 text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-amber-600 hover:to-rose-600 rounded-lg shadow-md transition duration-300"
            >
              Review Code
            </button>
            <button
              onClick={() => {
                setReview("");
                setCodeQuality(null);
              }}
              className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Clear Review
            </button>
          </div>
        </div>

        {/* Review Output Panel */}
        <div className="w-1/2 h-[80vh] bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 overflow-auto flex flex-col gap-4">
          {codeQuality !== null && (
            <div className="text-xl font-semibold text-amber-300">
              Code Quality Score: {codeQuality}/100
            </div>
          )}

          <div
            id="review-output"
            className="prose max-w-none prose-pre:bg-gray-900 prose-pre:text-amber-200 prose-code:text-amber-200 text-yellow-100"
          >
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </div>

          {review && (
            <button
              onClick={exportToPDF}
              className="mt-auto py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              📄 Export Review as PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
