// submit.js
import { useState } from 'react';
import { useStore } from './store';
import { runPipeline } from './runPipeline';

export const SubmitButton = () => {
    const { nodes, edges, updateNodeField } = useStore((state) => ({
        nodes: state.nodes,
        edges: state.edges,
        updateNodeField: state.updateNodeField,
    }));
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Failed to connect to backend');
        }
    };

    const handleRun = () => {
        const outputs = runPipeline(nodes, edges);
        Object.entries(outputs).forEach(([nodeId, val]) => {
            updateNodeField(nodeId, 'output', val.output);
            updateNodeField(nodeId, 'inputs', val.inputs);
            updateNodeField(nodeId, 'display', val.display);
        });
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
            <button onClick={handleRun} className="bg-green-700 hover:bg-green-600 text-white font-medium py-2.5 px-8 rounded-lg transition-colors border border-green-600">Run Pipeline</button>
            <button onClick={handleSubmit} className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 px-8 rounded-lg transition-colors border border-gray-700">Submit</button>
            {result && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setResult(null)}>
                    <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl p-8 min-w-[320px]" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-white mb-6">Pipeline Summary</h2>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex justify-between"><span>Nodes</span><span className="text-white font-medium">{result.num_nodes}</span></div>
                            <div className="flex justify-between"><span>Edges</span><span className="text-white font-medium">{result.num_edges}</span></div>
                            <div className="flex justify-between"><span>Is DAG</span><span className="text-white font-medium">{result.is_dag ? 'Yes' : 'No'}</span></div>
                        </div>
                        <button onClick={() => setResult(null)} className="mt-6 w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700">Close</button>
                    </div>
                </div>
            )}
            {error && <div className="text-sm text-red-400">{error}</div>}
        </div>
    );
}
