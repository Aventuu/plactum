import { Check } from "lucide-react";

export default function FeatureList({
  items,
  checkColor,
}: {
  items: string[];
  checkColor: string;
}) {
  return (
    <ul className="mt-6 space-y-3 text-sm text-muted">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2">
          <Check size={16} style={{ color: checkColor, marginTop: 2, flexShrink: 0 }} />
          {f}
        </li>
      ))}
    </ul>
  );
}
