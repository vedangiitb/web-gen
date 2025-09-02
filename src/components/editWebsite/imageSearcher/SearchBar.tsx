import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="flex gap-4 items-center mb-4">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., a person giving an interview..."
        onKeyDown={async (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            await onSearch();
          }
        }}
      />
      <Button onClick={onSearch}>
        <MoveRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
