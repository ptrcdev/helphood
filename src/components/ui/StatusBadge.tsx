import { Badge } from "./Badge";

export default function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, string> = {
        open: "bg-yellow-100 text-yellow-800",
        accepted: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-gray-100 text-gray-800",
    };

    const labels: Record<string, string> = {
        open: "Open",
        accepted: "Accepted",
        completed: "Completed",
        cancelled: "Cancelled",
    };

    return (
        <Badge variant="outline" className={`${variants[status]} border-none`}>
            {labels[status]}
        </Badge>
    );
};