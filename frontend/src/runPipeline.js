function getHandleId(qualifiedHandle, nodeId) {
  if (!qualifiedHandle || !nodeId) return null;
  return qualifiedHandle.replace(`${nodeId}-`, '');
}

export function runPipeline(nodes, edges) {
  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);

  const adj = {};
  const inDegree = {};
  nodes.forEach(n => { adj[n.id] = []; inDegree[n.id] = 0; });
  edges.forEach(e => {
    adj[e.source].push(e.target);
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
  });

  const queue = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
  const order = [];
  while (queue.length) {
    const id = queue.shift();
    order.push(id);
    adj[id].forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    });
  }

  const outputs = {};

  function getInputs(nodeId) {
    const inputs = {};
    edges.filter(e => e.target === nodeId).forEach(e => {
      const handle = getHandleId(e.targetHandle, nodeId);
      const sourceVal = outputs[e.source]?.output;
      if (handle && sourceVal !== undefined) inputs[handle] = sourceVal;
    });
    return inputs;
  }

  for (const nodeId of order) {
    const node = nodeMap[nodeId];
    const inputs = getInputs(nodeId);
    let result = null;
    let display = null;

    if (node.type === 'customInput') {
      result = node.data?.value || '';
    } else if (node.type === 'text') {
      let text = node.data?.text || '';
      Object.entries(inputs).forEach(([key, val]) => {
        text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
      });
      result = text;
    } else if (node.type === 'llm') {
      const system = inputs['system'] || '';
      const prompt = inputs['prompt'] || '';
      const temp = node.data?.temperature ?? 0.7;
      const maxT = node.data?.maxTokens ?? 256;
      result = JSON.stringify({
        response: `Processed: ${prompt}`,
        system: system,
        temperature: temp,
        max_tokens: maxT,
        timestamp: new Date().toLocaleTimeString(),
      });
    } else if (node.type === 'parseJson') {
      const raw = Object.values(inputs)[0] || node.data?.input || '';
      try {
        const parsed = JSON.parse(raw);
        result = JSON.stringify(parsed, null, 2);
        display = parsed;
      } catch {
        result = raw;
        display = null;
      }
    } else if (node.type === 'customOutput') {
      result = Object.values(inputs)[0] || '';
    }

    outputs[nodeId] = { output: result, inputs, display };
  }

  return outputs;
}
