import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_"),
  );
  const [outputType, setOutputType] = useState(data.outputType || "Text");

  return (
    <BaseNode
      id={id}
      label="Output"
      handles={[{ type: "target", position: Position.Left, id: "value" }]}
    >
      <label>
        Name:
        <input
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
        />
      </label>
      <label>
        Type:
        <select
          value={outputType}
          onChange={(e) => setOutputType(e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </label>
      {data?.output !== undefined && (
        <div className="mt-1.5 p-1.5 bg-green-900/30 border border-green-700 rounded text-xs text-black">
          Output: {data.output}
        </div>
      )}
    </BaseNode>
  );
};
