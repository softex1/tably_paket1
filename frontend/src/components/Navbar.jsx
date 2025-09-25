// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{ padding: "10px", backgroundColor: "#333", color: "#fff" }}>
            <Link to="/admin" style={{ marginRight: "20px", color: "#fff" }}>Admin Dashboard</Link>
            <Link to="/tables" style={{ color: "#fff" }}>Table Mapping</Link>
        </nav>
    );
}
