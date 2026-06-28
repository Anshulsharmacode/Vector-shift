from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import defaultdict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options('/pipelines/parse')
def options():
    return {}

class PipelineData(BaseModel):
    nodes: list[dict]
    edges: list[dict]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineData):
    nodes = pipeline.nodes
    edges = pipeline.edges

    num_nodes = len(nodes)
    num_edges = len(edges)

    # Build adjacency list for DAG check
    adj = defaultdict(list)
    in_degree = defaultdict(int)
    node_ids = {node['id'] for node in nodes}

    for edge in edges:
        src = edge['source']
        tgt = edge['target']
        adj[src].append(tgt)
        in_degree[tgt] += 1
        if src not in in_degree:
            in_degree[src] = 0

    # Kahn's algorithm for topological sort
    queue = [n for n in node_ids if in_degree.get(n, 0) == 0]
    visited = 0

    while queue:
        node = queue.pop(0)
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    is_dag = visited == len(node_ids) if node_ids else True

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag,
    }
