import { useState, useEffect } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

const formatValue = (v) => {
  if (v === null) return "null";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
};

const renderEntries = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item, i) => (
      <div key={i} style={{ fontSize: 11, marginLeft: 4 }}>
        <span style={{ color: "#888" }}>[{i}]:</span> {formatValue(item)}
      </div>
    ));
  }
  return Object.entries(obj)
    .slice(0, 8)
    .map(([k, v]) => (
      <div key={k} style={{ fontSize: 11, marginLeft: 4 }}>
        <span style={{ color: "#569cd6" }}>{k}:</span> {formatValue(v)}
      </div>
    ));
};

export const ParseJsonNode = ({ id, data }) => {
  const [input, setInput] = useState(data?.output || data?.input || "");
  const [parsed, setParsed] = useState(data?.display || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data?.output) {
      setInput(data.output);
      try {
        setParsed(JSON.parse(data.output));
        setError(null);
      } catch {
        setParsed(null);
      }
    }
  }, [data?.output]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    try {
      setParsed(JSON.parse(val));
      setError(null);
    } catch {
      setParsed(null);
      setError(val.trim() ? "Invalid JSON" : null);
    }
  };

  const displayObj = data?.display || parsed;

  return (
    <BaseNode
      id={id}
      label="Parse JSON"
      style={{ height: displayObj ? 220 : 180, width: 240 }}
      handles={[
        { type: "target", position: Position.Left, id: "input" },
        { type: "source", position: Position.Right, id: "output" },
      ]}
    >
      <textarea
        value={input}
        onChange={handleChange}
        placeholder='{"key": "value"}'
        rows={2}
        style={{ width: "90%", fontSize: 11, fontFamily: "monospace" }}
      />
      {error && <span style={{ color: "#f44747", fontSize: 11 }}>{error}</span>}
      {displayObj && (
        <div
          style={{
            marginTop: 4,
            maxHeight: 90,
            overflowY: "auto",
            background: "#d8d7d7",
            padding: 4,
            borderRadius: 4,
          }}
        >
          {renderEntries(displayObj)}
        </div>
      )}
    </BaseNode>
  );
};
