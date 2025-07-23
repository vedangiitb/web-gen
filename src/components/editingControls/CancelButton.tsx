import { X } from "lucide-react";

export function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-full bg-gray-100 text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray focus:ring-opacity-75 transition-all duration-200 ease-in-out"
      aria-label="Cancel"
    >
      <X size={16} />
    </button>
  );
}
