import type { ReactNode } from "react";

function inlineMarkdown(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/[^)\s]+|mailto:[^)\s]+)\))/g;
  return text.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)\s]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    return part;
  });
}

export default function MarkdownPreview({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }
    if (line.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push(<pre key={`code-${index}`}><code>{code.join("\n")}</code></pre>);
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const Tag = `h${heading[1].length}` as "h1" | "h2" | "h3";
      blocks.push(<Tag key={`heading-${index}`}>{inlineMarkdown(heading[2])}</Tag>);
      index += 1;
      continue;
    }
    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) { blocks.push(<hr key={`hr-${index}`}/>); index += 1; continue; }
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ""));
      blocks.push(<blockquote key={`quote-${index}`}>{quote.map((part, quoteIndex) => <p key={quoteIndex}>{inlineMarkdown(part)}</p>)}</blockquote>);
      continue;
    }
    const listMatch = line.match(/^\s*(?:[-*+]\s+|\d+\.\s+)(.*)$/);
    if (listMatch) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (index < lines.length && /^\s*(?:[-*+]\s+|\d+\.\s+)/.test(lines[index])) items.push(lines[index++].replace(/^\s*(?:[-*+]\s+|\d+\.\s+)/, ""));
      const List = ordered ? "ol" : "ul";
      blocks.push(<List key={`list-${index}`}>{items.map((item, itemIndex) => {
        const checkbox = item.match(/^\[([ xX])\]\s*(.*)$/);
        return <li key={itemIndex}>{checkbox ? <><span className={`markdown-check ${checkbox[1].toLowerCase() === "x" ? "checked" : ""}`} aria-label={checkbox[1].toLowerCase() === "x" ? "complete" : "incomplete"}>{checkbox[1].toLowerCase() === "x" ? "✓" : ""}</span>{inlineMarkdown(checkbox[2])}</> : inlineMarkdown(item)}</li>;
      })}</List>);
      continue;
    }
    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,3}\s|```|>\s?|\s*(?:[-*+]\s+|\d+\.\s+))/.test(lines[index])) paragraph.push(lines[index++]);
    blocks.push(<p key={`paragraph-${index}`}>{paragraph.map((part, partIndex) => <span key={partIndex}>{partIndex > 0 && <br/>}{inlineMarkdown(part)}</span>)}</p>);
  }
  return <div className="markdown-preview">{blocks.length ? blocks : <p className="markdown-empty">Nothing to preview yet.</p>}</div>;
}
