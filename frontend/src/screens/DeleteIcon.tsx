import { Trash2 } from "lucide-react";

interface DeleteIconProps {
  onClick: () => void;
}

export default function DeleteIcon({ onClick }: DeleteIconProps) {
  return (
    <div style={{ minWidth: 20, display: "flex", justifyContent: "flex-end" }}>
      <Trash2
        size={16}
        strokeWidth={2}
        style={{
          cursor: "pointer",
          color: "#fb7185",
        }}
        onClick={onClick}
      />
    </div>
  );
}