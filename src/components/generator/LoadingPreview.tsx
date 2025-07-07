import { LoaderCircle } from "lucide-react";

export default function LoadingPreview() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-10 gap-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg">
      <div className="flex items-center gap-4">
        <LoaderCircle className="animate-spin text-indigo-500 w-10 h-10" />
        <h2 className="font-bold text-3xl text-indigo-700 drop-shadow">
          Generating your website
        </h2>
      </div>
      <p className="text-lg text-gray-600">
        Your website will be ready in seconds!
      </p>
    </div>
  );
}
