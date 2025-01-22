import { useState, useEffect } from "react";
import MonacoEditor from "react-monaco-editor";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import { VscDebugStart } from "react-icons/vsc";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [editorWidth, setEditorWidth] = useState(600); // Initial editor width

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
    fetch("https://compiler-2-donp.onrender.com/run", {
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
    editor.layout();
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    // Ensure editor width does not become too small or too large
    const minEditorWidth = 300;
    const maxEditorWidth = window.innerWidth - 200; // Leave space for the output window

    const newWidth = e.clientX;
    if (newWidth >= minEditorWidth && newWidth <= maxEditorWidth) {
      setEditorWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="app-wrapper">
      <DeviceFrameset device="MacBook Pro">
        <div className="app-container">
          <h1 className="app-title">Online JavaScript Compiler</h1>

          <button
            className="run-button"
            onClick={handleRunCode}
            disabled={loading}
          >
            {loading ? (
              "Running..."
            ) : (
              <div style={{ padding: "0.5pc" }}>
                Run <VscDebugStart />
              </div>
            )}
          </button>
          <div className="app-content">
            <div
              className="monaco-editor-container"
              style={{ width: `${editorWidth}px` }}
            >
              <MonacoEditor
                width="100%"
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                editorDidMount={editorDidMount}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  padding: { top: 0, bottom: 0 },
                  automaticLayout: true,
                }}
              />
            </div>
            <div className="resizer" onMouseDown={handleMouseDown}></div>
            <div className="output-container">
              <p className="output-title">Output:</p>
              <pre className="output-result">{result}</pre>
              {loading && <p className="loading-text">Loading...</p>}
            </div>
          </div>
        </div>
      </DeviceFrameset>
    </div>
  );
}

export default App;
