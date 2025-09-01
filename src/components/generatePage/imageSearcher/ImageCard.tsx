import { Check } from "lucide-react";

export default function ImageCard({
  thumbUrl,
  fullUrl,
  onClick,
}: {
  thumbUrl: string;
  fullUrl: string;
  onClick: () => void;
}) {
  return (
    <div className="relative group" onClick={onClick}>
      <img
        src={thumbUrl}
        alt="search result"
        className="mb-2 rounded-sm w-full shadow hover:scale-105 transition duration-300 group-hover:brightness-75"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:cursor-pointer transition duration-300">
        <Check />
      </div>
    </div>
  );
}
