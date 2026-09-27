import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import Editor from "@monaco-editor/react";
import "./App.css";

type ConversionFormat = "camel_to_snake" | "snake_to_camel";
type Theme = "light" | "dark";

const DEFAULT_JSON = `{
  "userProfile": {
    "firstName": "John",
    "lastName": "Doe",
    "emailAddress": "john.doe@example.com",
    "isActive": true,
    "loginAttempts": 5,
    "favoriteColorsList": ["blue", "green"]
  },
  "subscriptionDetails": {
    "planType": "premium",
    "autoRenew": true
  }
}`;

function App() {
  const [inputJson, setInputJson] = useState<string>(DEFAULT_JSON);
  const [outputJson, setOutputJson] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [isSorted, setIsSorted] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleConvert = async (format: ConversionFormat) => {
    if (!inputJson.trim()) return;

    try {
      const result: string = await invoke("convert_json_keys", {
        jsonStr: inputJson,
        format: format,
        sortKeys: isSorted,
      });
      setOutputJson(result);
      setErrorMsg(null); 
    } catch (error) {
      setErrorMsg("Oops! The JSON format looks invalid. Please double-check your syntax.");
      setOutputJson("");
    }
  };

  const editorTheme = theme === "dark" ? "vs-dark" : "light";

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-group">
          <h1>JSON Key Converter</h1>
          <p>Format your JSON keys easily and securely.</p>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </header>

      <main>
        <div className="editor-grid">
          <div className="editor-column">
            <label>Your JSON Code</label>
            <div className="editor-wrapper">
              <Editor
                height="450px"
                defaultLanguage="json"
                theme={editorTheme}
                value={inputJson}
                onChange={(value) => setInputJson(value || "")}
                options={{
                  minimap: { enabled: false },
                  formatOnPaste: true,
                  fontSize: 14,
                  padding: { top: 16 }
                }}
              />
            </div>
          </div>
          
          <div className="editor-column">
            <label>Result</label>
            <div className="editor-wrapper">
              <Editor
                height="450px"
                defaultLanguage="json"
                theme={editorTheme}
                value={outputJson}
                options={{
                  minimap: { enabled: false },
                  readOnly: true,
                  fontSize: 14,
                  padding: { top: 16 }
                }}
              />
            </div>
          </div>
        </div>

        <div className="action-section">
          {errorMsg && (
            <div className="error-banner">
              {errorMsg}
            </div>
          )}
          
          {/* Fitur Sort By Alphabetically */}
          <div className="options-section">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={isSorted} 
                onChange={(e) => setIsSorted(e.target.checked)} 
              />
              Sort keys alphabetically (A-Z)
            </label>
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn btn-snake" 
              onClick={() => handleConvert("camel_to_snake")}
            >
              Format to snake_case 🐍
            </button>
            <button 
              className="btn btn-camel" 
              onClick={() => handleConvert("snake_to_camel")}
            >
              Format to camelCase 🐫
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
