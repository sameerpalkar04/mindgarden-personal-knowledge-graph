import { useEffect, useMemo, useState } from "react";
import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge } from "reactflow";
import "reactflow/dist/style.css";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { getGraph } from "../services/graph.service";
import { GraphToolbar } from "../components/graph/GraphToolbar";
import "../graph.css";

const tagColors = ["#e9f0ea", "#edf0fb", "#f8eee8", "#f4edf7", "#edf4f4", "#f5f1e7", "#f8eaea", "#eaf2f7"];

export default function GraphPage() {
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [allEdges, setAllEdges] = useState<Edge[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [focusNode, setFocusNode] = useState("");
  const [colorByTag, setColorByTag] = useState(false);
  const [groupByTag, setGroupByTag] = useState(false);

  useEffect(() => {
    let active = true;
    getGraph().then(response => {
      if (!active) return;
      setAllNodes(response.data.data.nodes as Node[]);
      setAllEdges(response.data.data.edges as Edge[]);
    }).catch(() => { if (active) setError("We couldn’t load your knowledge graph. Please try again."); });
    return () => { active = false; };
  }, []);

  const tags = useMemo(() => Array.from(new Set(allNodes.flatMap(node => Array.isArray(node.data.tags) ? node.data.tags as string[] : []))).sort(), [allNodes]);
  const visibleGraph = useMemo(() => {
    const needle = search.trim().toLowerCase();
    let filtered = allNodes.filter(node => {
      const nodeTags = Array.isArray(node.data.tags) ? node.data.tags as string[] : [];
      const text = `${String(node.data.label ?? "")} ${String(node.data.content ?? "")} ${nodeTags.join(" ")}`.toLowerCase();
      return (!needle || text.includes(needle)) && (!tagFilter || nodeTags.includes(tagFilter));
    });
    if (focusNode) {
      const neighbors = new Set([focusNode]);
      allEdges.forEach(edge => { if (edge.source === focusNode) neighbors.add(edge.target); if (edge.target === focusNode) neighbors.add(edge.source); });
      filtered = filtered.filter(node => neighbors.has(node.id));
    }
    const visibleIds = new Set(filtered.map(node => node.id));
    const edges = allEdges.filter(edge => visibleIds.has(edge.source) && visibleIds.has(edge.target));
    const groupName = (node: Node) => {
      const nodeTags = Array.isArray(node.data.tags) ? node.data.tags as string[] : [];
      return nodeTags[0] || "Untagged";
    };
    const groups = new Map<string, Node[]>();
    filtered.forEach(node => { const key = groupName(node); groups.set(key, [...(groups.get(key) || []), node]); });
    const groupList = [...groups.entries()];
    const clusterRadius = Math.max(280, groupList.length * 155);
    const tagColor = new Map(tags.map((tag, index) => [tag, tagColors[index % tagColors.length]]));
    const nodes = filtered.map(node => {
      const group = groupList.findIndex(([key]) => key === groupName(node));
      const members = groupList[group][1];
      const memberIndex = members.findIndex(item => item.id === node.id);
      let x: number;
      let y: number;
      if (groupByTag && groupList.length > 1) {
        const groupAngle = (2 * Math.PI * group) / groupList.length;
        const memberRadius = Math.max(70, members.length * 30);
        const memberAngle = (2 * Math.PI * memberIndex) / members.length;
        x = Math.cos(groupAngle) * clusterRadius + Math.cos(memberAngle) * memberRadius;
        y = Math.sin(groupAngle) * clusterRadius + Math.sin(memberAngle) * memberRadius;
      } else {
        const radius = Math.max(190, filtered.length * 36);
        const angle = (2 * Math.PI * filtered.findIndex(item => item.id === node.id)) / Math.max(filtered.length, 1);
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
      }
      const color = tagColor.get(groupName(node)) || "#ffffff";
      return { ...node, position: { x, y }, style: { ...node.style, background: colorByTag ? color : "#ffffff", borderColor: colorByTag ? "#d9e2da" : "#dfe7df" } };
    });
    return { nodes, edges };
  }, [allNodes, allEdges, search, tagFilter, focusNode, colorByTag, groupByTag, tags]);

  return <div className="app-shell"><Navbar/><div className="graph-layout"><Sidebar/><main className="graph-main"><div className="graph-heading"><div className="eyebrow">Explore your ideas</div><h1>Knowledge graph</h1><p>Showing {visibleGraph.nodes.length} of {allNodes.length} notes · {visibleGraph.edges.length} connections</p><GraphToolbar nodes={allNodes} tags={tags} search={search} onSearch={setSearch} tagFilter={tagFilter} onTagFilter={setTagFilter} focusNode={focusNode} onFocusNode={setFocusNode} colorByTag={colorByTag} onColorByTag={setColorByTag} groupByTag={groupByTag} onGroupByTag={setGroupByTag}/></div>
    {error ? <div className="empty-state">{error}</div> : allNodes.length === 0 ? <div className="empty-state" style={{ margin: 28 }}><h3>Your graph is waiting for its first idea</h3><p>Create a few notes and link them together to see connections emerge.</p></div> : visibleGraph.nodes.length === 0 ? <div className="empty-state" style={{ margin: 28 }}><h3>No notes match these controls</h3><p>Try a different search, tag, or focus note.</p></div> : <div className="graph-canvas"><ReactFlow nodes={visibleGraph.nodes} edges={visibleGraph.edges} fitView fitViewOptions={{ padding: 0.25 }} minZoom={0.2}><MiniMap nodeColor={node => colorByTag ? tagColors[tags.indexOf((Array.isArray(node.data.tags) ? node.data.tags as string[] : [])[0]) % tagColors.length] || "#72917a" : "#72917a"} maskColor="#f5f6f299"/><Controls/><Background color="#dce2dc" gap={20} size={1}/></ReactFlow></div>}
  </main></div></div>;
}
