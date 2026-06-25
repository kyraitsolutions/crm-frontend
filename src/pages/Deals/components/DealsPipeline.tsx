import { useState } from "react";
import DealCard from "./DealCard";

interface Deal {
    id: string;
    title: string;
    amount: string;
    owner: string;
    score: number;
    health: "Hot" | "Warm" | "Cold";
}

interface Stage {
    id: string;
    name: string;
    deals: Deal[];
}

const initialStages: Stage[] = [
    {
        id: "qualification",
        name: "Qualification",
        deals: [
            { id: "d1", title: "Hilton Resort", amount: "₹250,000", owner: "John Smith", score: 92, health: "Hot" },
            { id: "d2", title: "Hilton Resort", amount: "₹250,000", owner: "John Smith", score: 92, health: "Hot" },
        ],
    },
    {
        id: "needs-analysis", name: "Needs Analysis", deals: [
            { id: "d1", title: "Hilton Resort", amount: "₹250,000", owner: "John Smith", score: 92, health: "Hot" },
        ]
    },
    {
        id: "proposal", name: "Proposal", deals: [
            { id: "d1", title: "Hilton Resort", amount: "₹250,000", owner: "John Smith", score: 92, health: "Hot" },
        ]
    },
    {
        id: "negotiation", name: "Negotiation", deals: [
            { id: "d1", title: "Hilton Resort", amount: "₹250,000", owner: "John Smith", score: 92, health: "Hot" },
        ]
    },
    {
        id: "closed-won", name: "Closed Won", deals: [
            { id: "d1", title: "Hilton Resort", amount: "₹250,000", owner: "John Smith", score: 92, health: "Hot" },
        ]
    },
];

export default function DealsPipeline() {
    const [stages, setStages] = useState<Stage[]>(initialStages);
    const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
    const [draggedFromStageId, setDraggedFromStageId] = useState<string | null>(null);
    const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, deal: Deal) => {
        const fromStage = stages.find((s) => s.deals.some((d) => d.id === deal.id));
        setDraggedDeal(deal);
        setDraggedFromStageId(fromStage?.id ?? null);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
        setDraggedDeal(null);
        setDraggedFromStageId(null);
        setDragOverStageId(null);
    };

    const handleDragOver = (e: React.DragEvent, stageId: string) => {
        e.preventDefault();
        setDragOverStageId(stageId);
    };

    const handleDrop = (targetStageId: string) => {
        if (!draggedDeal || !draggedFromStageId || draggedFromStageId === targetStageId) {
            setDragOverStageId(null);
            return;
        }

        setStages((prev) =>
            prev.map((stage) => {
                if (stage.id === draggedFromStageId) {
                    return { ...stage, deals: stage.deals.filter((d) => d.id !== draggedDeal.id) };
                }
                if (stage.id === targetStageId) {
                    return { ...stage, deals: [...stage.deals, draggedDeal] };
                }
                return stage;
            })
        );
        setDragOverStageId(null);
    };

    console.log(stages);
    return (
        <div className="h-screen bg-slate-200 flex flex-col">
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-5 px-6 overflow-x-auto pb-6 mt-6">
                {stages.map((stage, index) => {
                    const total = stage.deals.reduce(
                        (sum, d) => sum + Number(d.amount.replace(/[^0-9.]/g, "")),
                        0
                    );
                    const isOver = dragOverStageId === stage.id;

                    return (
                        <div
                            key={stage.id}
                            onDragOver={(e) => handleDragOver(e, stage.id)}
                            onDragLeave={() => setDragOverStageId(null)}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleDrop(stage.id);
                            }}
                            className={`${index === stages.length - 1 ? "border-r" : ""} border-l border-t transition-colors ${isOver ? "border-indigo-400 border-2 bg-indigo-50/40" : "border-gray-200"
                                }`}
                        >
                            <div className="p-4  border-t-3 border-t-green-300 bg-green-300/40 shadow-sm">
                                <h3 className="font-semibold">{stage.name}</h3>
                                <p className="text-sm text-gray-500">
                                    ₹{total.toLocaleString("en-IN")} · {stage.deals.length} deal
                                    {stage.deals.length !== 1 ? "s" : ""}
                                </p>
                            </div>

                            <div className="space-y-3 min-h-[100px] flex flex-col gap-2 items-center justify-center mt-3">
                                {stage.deals.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center py-4">No Deals Found</p>
                                ) : (
                                    stage.deals.map((deal) => (
                                        <DealCard
                                            key={deal.id}
                                            deal={deal}
                                            onDragStart={handleDragStart}
                                            onDragEnd={handleDragEnd}
                                            isDragging={draggedDeal?.id === deal.id}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}