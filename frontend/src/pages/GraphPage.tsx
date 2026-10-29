import { useEffect, useState } from "react";
import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge } from "reactflow";
import "reactflow/dist/style.css";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { getGraph } from "../services/graph.service";

export default function GraphPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadGraph() {
      try {
        const response = await getGraph();
        const graphNodes = response.data.data.nodes as Node[];
        const count = graphNodes.length;
        const radius = Math.max(180, count * 26);
        setNodes(graphNodes.map((node, index) => ({ ...node, position: { x: Math.cos((2 * Math.PI * index) / Math.max(count, 1)) * radius, y: Math.sin((2 * Math.PI * index) / Math.max(count, 1)) * radius } })));
        setEdges(response.data.data.edges as Edge[]);
      } catch { setError("We couldn’t load your knowledge graph. Please try again."); }
    }
    void loadGraph();
  }, []);

  return <div className="app-shell"><Navbar/><div className="graph-layout"><Sidebar/><main className="graph-main"><div className="graph-heading"><div className="eyebrow">Explore your ideas</div><h1>Knowledge graph</h1><p>{nodes.length} notes · {edges.length} connections. Drag notes to arrange your space.</p></div>
    {error ? <div className="empty-state">{error}</div> : nodes.length === 0 ? <div className="empty-state" style={{ margin: 28 }}><h3>Your graph is waiting for its first idea</h3><p>Create a few notes and link them together to see connections emerge.</p></div> : <div className="graph-canvas"><ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.25 }} minZoom={0.2}><MiniMap nodeColor="#72917a" maskColor="#f5f6f299"/><Controls/><Background color="#dce2dc" gap={20} size={1}/></ReactFlow></div>}
  </main></div></div>;
}
