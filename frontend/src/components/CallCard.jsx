import React, { useState, useEffect } from "react";

export default function CallCard({ call, onResolved }) {
    const [resolved, setResolved] = useState(call.resolved);
    const [removed, setRemoved] = useState(false);

    const minutesPassed = Math.floor(
        (Date.now() - new Date(call.createdAt).getTime()) / 60000
    );

    const handleResolve = () => {
        fetch(`http://localhost:8080/api/calls/${call.id}/resolve`, { method: "POST" })
            .then(res => {
                if (res.ok) {
                    setResolved(true);

                    // wait 30s, then remove from UI
                    setTimeout(() => {
                        setRemoved(true);
                        onResolved(call.id);
                    }, 30000);
                }
            })
            .catch(err => console.error("Error resolving call:", err));
    };

    if (removed) return null;

    const bgColor = resolved
        ? "bg-green-500"
        : call.type === "WAITER"
            ? "bg-red-500"
            : "bg-blue-500";

    return (
        <div className={`p-6 rounded-2xl shadow-md text-white mb-4 ${bgColor}`}>
            <h2 className="text-3xl font-bold">Маса {call.table.tableNumber}</h2>
            <p className="text-lg mt-2">⏱️ {minutesPassed} минути</p>
            <button
                onClick={handleResolve}
                disabled={resolved}
                className="mt-4 px-4 py-2 rounded-xl bg-white text-black font-bold hover:bg-gray-200"
            >
                {resolved ? "Resolved" : "Resolve"}
            </button>
        </div>
    );
}
