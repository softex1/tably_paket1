// src/components/AddTableForm.jsx
import React, { useState } from "react";

export default function AddTableForm({ onTableAdded }) {
    const [tableNumber, setTableNumber] = useState("");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("Low");

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/api/tables", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tableNumber, location, type })
        })
            .then(res => res.json())
            .then(data => {
                onTableAdded(data);
                setTableNumber(""); setLocation(""); setType("Low");
            })
            .catch(err => console.error(err));
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Table Number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Low">Low</option>
                <option value="High">High</option>
            </select>
            <button type="submit">Add Table</button>
        </form>
    );
}
