import { Trash2 } from "lucide-react";

export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-300 hover:bg-gray-400 text-black p-1 rounded-full shadow"
    >
      <Trash2 className="text-red-700" size={16} />
    </button>
  );
}
