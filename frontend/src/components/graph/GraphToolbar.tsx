import type { Node } from "reactflow";
import { Layers2, Palette, Search, Target } from "lucide-react";

interface Props {
  nodes: Node[];
  tags: string[];
  search: string;
  onSearch: (value: string) => void;
  tagFilter: string;
  onTagFilter: (value: string) => void;
  focusNode: string;
  onFocusNode: (value: string) => void;
  colorByTag: boolean;
  onColorByTag: (value: boolean) => void;
  groupByTag: boolean;
  onGroupByTag: (value: boolean) => void;
}

export function GraphToolbar({ nodes, tags, search, onSearch, tagFilter, onTagFilter, focusNode, onFocusNode, colorByTag, onColorByTag, groupByTag, onGroupByTag }: Props) {
  return <div className="graph-toolbar" aria-label="Graph controls">
    <label className="graph-search"><Search size={15}/><input aria-label="Search graph" placeholder="Find a note…" value={search} onChange={event => onSearch(event.target.value)}/></label>
    <select aria-label="Filter graph by tag" value={tagFilter} onChange={event => onTagFilter(event.target.value)}><option value="">All tags</option>{tags.map(tag => <option value={tag} key={tag}>{tag}</option>)}</select>
    <select aria-label="Focus on note and neighbors" value={focusNode} onChange={event => onFocusNode(event.target.value)}><option value="">All notes</option>{nodes.map(node => <option value={node.id} key={node.id}>{String(node.data.label ?? "Untitled note")}</option>)}</select>
    <button type="button" className={colorByTag ? "active" : ""} aria-pressed={colorByTag} onClick={() => onColorByTag(!colorByTag)}><Palette size={14}/> Tag colors</button>
    <button type="button" className={groupByTag ? "active" : ""} aria-pressed={groupByTag} onClick={() => onGroupByTag(!groupByTag)}><Layers2 size={14}/> Group by tag</button>
    {focusNode && <button type="button" className="clear-focus" onClick={() => onFocusNode("")}><Target size={14}/> Clear focus</button>}
  </div>;
}
