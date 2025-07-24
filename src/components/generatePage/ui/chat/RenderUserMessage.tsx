export default function RenderUserMessage({ data }: { data: string }) {
  return (
    <div className="ml-auto max-w-[80%] bg-accent text-accent-foreground border border-border p-3 my-3 rounded-2xl shadow transition-transform animate-in fade-in slide-in-from-right-4">
      {data}
    </div>
  );
}
