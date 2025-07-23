import { Check } from "lucide-react";

export function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all duration-200 ease-in-out"
      aria-label="Save changes"
    >
      <Check size={16} />
    </button>
  );
}
