import { X } from "lucide-react";

export default function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-between items-center mb-2">
      <p className="font-semibold text-lg">Search Image</p>
      <X className="cursor-pointer" onClick={onClose} />
    </div>
  );
}
