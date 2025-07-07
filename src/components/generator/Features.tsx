import { CheckCircle } from "lucide-react"; // Lucide is used by shadcn/ui for icons

type FeaturesProps = {
  content: {
    title: string;
    featureList: string[];
  };
};

export default function Features({ content }: FeaturesProps) {
  if (!content) return null;

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-900">
        {content.title}
      </h2>
      <ul className="max-w-2xl mx-auto space-y-6">
        {content.featureList.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition"
          >
            <CheckCircle
              className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-lg text-blue-900">{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
