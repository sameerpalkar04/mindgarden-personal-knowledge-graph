import type { Tag } from "../../types/tag";

interface Props {
  tags: Tag[];
}

export default function TagList({ tags }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginTop: "15px",
      }}
    >
      {tags.map((tag) => (
        <span
          key={tag.id}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "14px",
          }}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
}