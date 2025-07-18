import { Check, Trash2, X } from "lucide-react";

export default function EditingControls({
  handleSave,
  setEditElement,
  deleteElement,
}: {
  handleSave: any;
  setEditElement: any;
  deleteElement?: any;
}) {
  return (
    <div className="absolute flex gap-1">
      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full shadow"
      >
        <Check size={16} />
      </button>
      <button
        onClick={() => setEditElement("")}
        className="bg-gray-300 hover:bg-gray-400 text-black p-1 rounded-full shadow"
      >
        <X size={16} />
      </button>

      {deleteElement ? (
        <button
          onClick={deleteElement}
          className="bg-gray-300 hover:bg-gray-400 text-black p-1 rounded-full shadow"
        >
          <Trash2 className="text-red-700" size={16} />
        </button>
      ) : null}
    </div>
  );
}
