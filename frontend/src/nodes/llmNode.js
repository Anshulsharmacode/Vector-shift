import { useState, useMemo, useRef, useEffect } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const LLMNode = ({ id, data }) => {
  const [temperature, setTemperature] = useState(data?.temperature ?? 0.7);
  const [maxTokens, setMaxTokens] = useState(data?.maxTokens ?? 256);
  const systemRef = useRef(null);
  const promptRef = useRef(null);
  const measureRef = useRef(null);

  const systemValue = data?.inputs?.system || data?.system || "";
  const promptValue = data?.inputs?.prompt || data?.prompt || "";

  useEffect(() => {
    if (systemRef.current) {
      systemRef.current.style.height = "auto";
      systemRef.current.style.height = `${systemRef.current.scrollHeight}px`;
    }
  }, [systemValue]);

  useEffect(() => {
    if (promptRef.current) {
      promptRef.current.style.height = "auto";
      promptRef.current.style.height = `${promptRef.current.scrollHeight}px`;
    }
  }, [promptValue]);

  const longestContent = useMemo(() => {
    const lines = [...systemValue.split("\n"), ...promptValue.split("\n")];
    return lines.reduce((max, line) => Math.max(max, line.length), 0);
  }, [systemValue, promptValue]);

  const contentWidth = useMemo(() => {
    if (measureRef.current && longestContent > 0) {
      measureRef.current.textContent = [
        ...systemValue.split("\n"),
        ...promptValue.split("\n"),
      ].reduce((a, b) => (a.length >= b.length ? a : b), "");
      return measureRef.current.offsetWidth;
    }
    return Math.max(longestContent * 7, 100);
  }, [systemValue, promptValue, longestContent]);

  return (
    <BaseNode
      id={id}
      label="LLM"
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: "system",
          style: { top: "30%" },
        },
        {
          type: "target",
          position: Position.Left,
          id: "prompt",
          style: { top: "60%" },
        },
        { type: "source", position: Position.Right, id: "response" },
      ]}
      style={{ width: Math.max(240, contentWidth + 55) }}
    >
      <span
        ref={measureRef}
        className="absolute invisible whitespace-pre text-xs"
        style={{ fontFamily: "inherit" }}
      />
      <div className="space-y-2 text-xs">
        <div>
          <label className="text-gray-500 block mb-0.5">System</label>
          <textarea
            ref={systemRef}
            value={systemValue}
            readOnly
            rows={1}
            placeholder="Connected nodes will provide this..."
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded p-1 resize-none overflow-hidden focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="text-gray-500 block mb-0.5">Prompt</label>
          <textarea
            ref={promptRef}
            value={promptValue}
            readOnly
            rows={1}
            placeholder="Connected nodes will provide this..."
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded p-1 resize-none overflow-hidden focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 w-16">Temp</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-gray-400 w-6 text-right">
            {temperature.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 w-16">Max Tokens</span>
          <input
            type="number"
            min="1"
            max="4096"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value) || 256)}
            className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        {data?.output && (
          <pre className="border rounded p-2 text-xs whitespace-pre-wrap bg-green-900/30">
            {JSON.stringify(JSON.parse(data.output), null, 2)}
          </pre>
        )}
      </div>
    </BaseNode>
  );
};
