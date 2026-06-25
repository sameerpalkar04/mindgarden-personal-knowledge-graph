import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "reactflow";

import "reactflow/dist/style.css";

import { getGraph } from "../services/graph.service";

export default function GraphPage() {
  const [nodes, setNodes] =useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    async function loadGraph() {
      try {
        const response = await getGraph();

        setNodes(response.data.data.nodes);
        setEdges(response.data.data.edges);
      } catch (err) {
        console.error(err);
      }
    }

    loadGraph();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <div
        style={{
          flex: 1,
          display: "flex",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}