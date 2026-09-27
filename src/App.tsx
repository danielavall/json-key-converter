import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConvert = async (format: "camel_to_snake" | "snake_to_camel") => {
    if (!inputJson.trim()) return;
    
    try {
      const result: string = await invoke("convert_json_keys", {
        jsonStr: inputJson,
        format: format,
      });
      setOutputJson(result);
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg("Invalid JSON format! Silakan periksa kembali sintaksnya.");
      setOutputJson("");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "0.5rem" }}>JSON Key Converter</h1>
      <p style={{ textAlign: "center", color: "#6b7280", marginTop: 0 }}>Secure Client-Side Processing (Rust + Wasm)</p>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", margin: "2rem 0" }}>
        <button 
          onClick={() => handleConvert("camel_to_snake")} 
          style={{ cursor: "pointer", padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold" }}>
          camelCase to snake_case
        </button>
        <button 
          onClick={() => handleConvert("snake_to_camel")} 
          style={{ cursor: "pointer", padding: "10px 20px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold" }}>
          snake_case to camelCase
        </button>
      </div>

      {errorMsg && <div style={{ color: "#ef4444", textAlign: "center", marginBottom: "1rem", fontWeight: 500 }}>{errorMsg}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: 600 }}>Input JSON</label>
          <textarea
            style={{ width: "100%", height: "450px", padding: "1rem", fontFamily: "monospace", borderRadius: "6px", border: "1px solid #d1d5db", boxSizing: "border-box" }}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder='{"exampleKey": "value"}'
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: 600 }}>Output JSON</label>
          <textarea
            readOnly
            style={{ width: "100%", height: "450px", padding: "1rem", fontFamily: "monospace", borderRadius: "6px", border: "1px solid #d1d5db", backgroundColor: "#f3f4f6", boxSizing: "border-box" }}
            value={outputJson}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
