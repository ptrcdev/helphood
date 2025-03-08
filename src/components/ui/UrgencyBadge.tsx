import { Badge } from "./Badge";

export default function UrgencyBadge({ urgency }: { urgency: string }) {
    const variants: Record<string, string> = {
        low: "bg-blue-100 text-blue-800",
        normal: "bg-yellow-100 text-yellow-800",
        high: "bg-red-100 text-red-800",
    };

    const labels: Record<string, string> = {
        low: "Low",
        normal: "Normal",
        high: "Urgent",
    };

    return (
        <Badge variant="outline" className={`${variants[urgency]} border-none`}>
            {labels[urgency]}
        </Badge>
    );
};