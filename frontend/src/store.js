// store.js

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";

export const useStore = create((set, get) => ({
  nodes: [
    {
      id: 'customInput-1',
      type: 'customInput',
      position: { x: 0, y: 280 },
      data: { inputName: 'msg', inputType: 'Text', value: 'What is the capital of France?' },
    },
    {
      id: 'customInput-2',
      type: 'customInput',
      position: { x: 0, y: 50 },
      data: { inputName: 'sys', inputType: 'Text', value: 'You are a helpful geography assistant' },
    },
    {
      id: 'text-1',
      type: 'text',
      position: { x: 280, y: 280 },
      data: { text: 'User asked: {{msg}}' },
    },
    {
      id: 'text-2',
      type: 'text',
      position: { x: 280, y: 50 },
      data: { text: 'System: {{sys}}' },
    },
    {
      id: 'llm-1',
      type: 'llm',
      position: { x: 560, y: 100 },
      data: { temperature: 0.7, maxTokens: 256 },
    },
    {
      id: 'parseJson-1',
      type: 'parseJson',
      position: { x: 840, y: 150 },
      data: {},
    },
    {
      id: 'customOutput-1',
      type: 'customOutput',
      position: { x: 1120, y: 150 },
      data: { outputName: 'result', outputType: 'Text' },
    },
  ],
  edges: [
    {
      id: 'e-customInput-1-text-1',
      source: 'customInput-1',
      sourceHandle: 'customInput-1-value',
      target: 'text-1',
      targetHandle: 'text-1-msg',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: 'arrowclosed', height: '20px', width: '20px' },
    },
    {
      id: 'e-text-1-llm-1',
      source: 'text-1',
      sourceHandle: 'text-1-output',
      target: 'llm-1',
      targetHandle: 'llm-1-prompt',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: 'arrowclosed', height: '20px', width: '20px' },
    },
    {
      id: 'e-customInput-2-text-2',
      source: 'customInput-2',
      sourceHandle: 'customInput-2-value',
      target: 'text-2',
      targetHandle: 'text-2-sys',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: 'arrowclosed', height: '20px', width: '20px' },
    },
    {
      id: 'e-text-2-llm-1',
      source: 'text-2',
      sourceHandle: 'text-2-output',
      target: 'llm-1',
      targetHandle: 'llm-1-system',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: 'arrowclosed', height: '20px', width: '20px' },
    },
    {
      id: 'e-llm-1-parseJson-1',
      source: 'llm-1',
      sourceHandle: 'llm-1-response',
      target: 'parseJson-1',
      targetHandle: 'parseJson-1-input',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: 'arrowclosed', height: '20px', width: '20px' },
    },
    {
      id: 'e-parseJson-1-customOutput-1',
      source: 'parseJson-1',
      sourceHandle: 'parseJson-1-output',
      target: 'customOutput-1',
      targetHandle: 'customOutput-1-value',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: 'arrowclosed', height: '20px', width: '20px' },
    },
  ],
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px" },
        },
        get().edges,
      ),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }

        return node;
      }),
    });
  },
}));
