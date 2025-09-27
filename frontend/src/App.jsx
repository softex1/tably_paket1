import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard.jsx';
import TableMapping from './pages/TableMapping.jsx';
import ClientPage from "./pages/ClientPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const adminData = sessionStorage.getItem('adminData');

    if (!adminData) {
        // Redirect to login page with the return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/table/:id" element={<ClientPage />} />
                <Route path="/table/:id/:token" element={<ClientPage />} />

                {/* Protected Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/tables" element={
                    <ProtectedRoute>
                        <TableMapping />
                    </ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute>
                        <UsersPage />
                    </ProtectedRoute>
                } />
                <Route path="/contact" element={
                    <ProtectedRoute>
                        <ContactPage />
                    </ProtectedRoute>
                } />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/admin" replace />} />
            </Routes>
        </Router>
    );
}

export default App;