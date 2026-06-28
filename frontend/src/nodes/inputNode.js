import { useState, useEffect } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_"),
  );
  const [inputType, setInputType] = useState(data.inputType || "Text");
  const [inputValue, setInputValue] = useState(data?.value || "");

  useEffect(() => {
    data.value = inputValue;
  }, [inputValue, data]);

  return (
    <BaseNode
      id={id}
      label="Input"
      handles={[{ type: "source", position: Position.Right, id: "value" }]}
    >
      <div className="space-y-1.5">
        <label className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 w-10">Name</span>
          <input
            type="text"
            value={currName}
            onChange={(e) => setCurrName(e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 w-10">Type</span>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 w-10">Value</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value..."
            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </label>
      </div>
    </BaseNode>
  );
};
