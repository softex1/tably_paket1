import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import TableMapping from "./pages/TableMapping";
import ClientPage from "./pages/ClientPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected routes (admin only) */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tables"
                    element={
                        <ProtectedRoute>
                            <TableMapping />
                        </ProtectedRoute>
                    }
                />

                {/* Public client routes (scanned by customers) */}
                <Route path="/table/:id" element={<ClientPage />} />
                <Route path="/table/:id/:token" element={<ClientPage />} />
            </Routes>
        </BrowserRouter>
    );
}
