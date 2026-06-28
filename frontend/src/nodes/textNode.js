import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "");
  const textareaRef = useRef(null);
  const measureRef = useRef(null);

  const variables = useMemo(() => {
    const matches = currText.match(/\{\{(.*?)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "").trim()))];
  }, [currText]);

  const handles = useMemo(() => {
    const result = [{ type: "source", position: Position.Right, id: "output" }];
    variables.forEach((v, i) => {
      result.push({
        type: "target",
        position: Position.Left,
        id: v,
        style: { top: `${((i + 1) / (variables.length + 1)) * 100}%` },
      });
    });
    return result;
  }, [variables]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  const longestLine = useMemo(() => {
    return currText
      .split("\n")
      .reduce((max, line) => Math.max(max, line.length), 0);
  }, [currText]);

  const textWidth = useMemo(() => {
    if (measureRef.current && longestLine > 0) {
      measureRef.current.textContent = currText
        .split("\n")
        .reduce((a, b) => (a.length >= b.length ? a : b), "");
      return measureRef.current.offsetWidth;
    }
    return longestLine * 7;
  }, [currText, longestLine]);

  return (
    <BaseNode
      id={id}
      label="Text"
      handles={handles}
      style={{ width: Math.max(180, textWidth + 55) }}
    >
      <span
        ref={measureRef}
        className="absolute invisible whitespace-pre text-xs"
        style={{ fontFamily: "inherit" }}
      />
      <label className="text-xs text-gray-500">Text</label>
      <textarea
        ref={textareaRef}
        value={currText}
        onChange={(e) => setCurrText(e.target.value)}
        className="w-full text-xs bg-gray-50 border border-gray-200 rounded p-1 resize-none overflow-hidden focus:outline-none focus:ring-1 focus:ring-gray-400"
        rows={1}
      />
      {data?.output !== undefined && (
        <div className="mt-1.5 p-1.5 bg-green-900/30 border border-green-700 rounded text-xs text-black">
          Output: {data.output}
        </div>
      )}
    </BaseNode>
  );
};
