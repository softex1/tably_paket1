import {BrowserRouter as Router, Routes, Route, HashRouter} from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard.jsx';
import TableMapping from './pages/TableMapping.jsx';
import ClientPage from "./pages/ClientPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/tables" element={<TableMapping />} />
                <Route path="/table/:id" element={<ClientPage />} />
                <Route path="/table/:id/:token" element={<ClientPage />} />
            </Routes>
        </Router>
    );
}

export default App;