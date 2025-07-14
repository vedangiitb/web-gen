import ReactMarkdown from "react-markdown";

export default function RenderAIResponse({ data }: { data: string }) {
  return (
    <div
      className="mr-auto py-4 max-w-2xl whitespace-pre-wrap"
      style={{
        fontFamily: " Segoe UI, Arial, sans-serif",
        fontSize: "1rem",
      }}
    >
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }) {
            return (
              <code
                className={`rounded px-1 py-0.5 text-sm ${
                  className || ""
                }`}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ node, children, ...props }) {
            return (
              <pre
                className="rounded p-2 overflow-x-auto my-2"
                {...props}
              >
                {children}
              </pre>
            );
          },
        }}
      >
        {data}
      </ReactMarkdown>
    </div>
  );
}
