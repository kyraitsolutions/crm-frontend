interface Deal {
    id: string;
    title: string;
    amount: string;
    owner: string;
    score: number;
    health: "Hot" | "Warm" | "Cold";
}

interface DealCardProps {
    deal: Deal;
    onDragStart: (e: React.DragEvent, deal: Deal) => void;
    onDragEnd: () => void;
    isDragging: boolean;
}

const healthStyles: Record<string, string> = {
    Hot: "bg-red-100 text-red-600",
    Warm: "bg-amber-100 text-amber-600",
    Cold: "bg-blue-100 text-blue-600",
};

export default function DealCard({ deal, onDragStart, onDragEnd, isDragging }: DealCardProps) {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, deal)}
            onDragEnd={onDragEnd}
            className={` w-full rounded-xl p-4 bg-white cursor-grab active:cursor-grabbing shadow-sm transition ${isDragging ? "opacity-40" : "opacity-100"
                }`}
        >
            <div className="flex justify-between">
                <h4 className="font-semibold">{deal.title}</h4>
                <span className={`text-xs px-2 py-1 rounded ${healthStyles[deal.health] ?? "bg-gray-100 text-gray-600"}`}>
                    {deal.health}
                </span>
            </div>

            <p className="text-xl font-bold mt-2">{deal.amount}</p>

            <div className="mt-3 flex justify-between text-sm text-gray-500">
                <span>{deal.owner}</span>
                <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                    AI {deal.score}
                </span>
            </div>

            <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                    <span>Deal Progress</span>
                    <span>80%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-indigo-600 rounded w-4/5"></div>
                </div>
            </div>
        </div>
    );
}