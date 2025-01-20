import { useState, useEffect } from "react";
import MonacoEditor from "react-monaco-editor";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const handleRunCode = () => {
    setLoading(true);
    fetch("http://localhost:3000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data.output);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleEditorChange = (newValue) => {
    setCode(newValue);
  };

  const editorDidMount = (editor) => {
    // Trigger a layout recalculation
    editor.layout();
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Online JavaScript Compiler</h1>
      <button className="run-button" onClick={handleRunCode} disabled={loading}>
        {loading ? "Running..." : "Run"}
      </button>
      <div className="app-content">
        <MonacoEditor
          width="900"
          height="600"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          editorDidMount={editorDidMount}
          options={{
            minimap: { enabled: false }, // Disable minimap if it's not needed
            lineNumbers: "on", // Ensure line numbers are on
            scrollBeyondLastLine: false, // Prevent scrolling beyond the last line
            padding: { top: 0, bottom: 0 }, // Add padding to prevent text from starting in the middle
            automaticLayout: true, // Automatically adjust layout
          }}
        />
        <div className="output-container">
          <p className="output-title">Output:</p>
          <pre className="output-result">{result}</pre>
          {loading && <p className="loading-text">Loading...</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
