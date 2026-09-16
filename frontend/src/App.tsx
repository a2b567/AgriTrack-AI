import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Livestock from "./pages/Livestock"
import LivestockProfile from "./pages/LivestockProfile"
import Scanner from "./pages/Scanner"
import Vaccinations from "./pages/Vaccinations"
import Breeding from "./pages/Breeding"
import Feed from "./pages/Feed"
import Finance from "./pages/Finance"
import Settings from "./pages/Settings"
import DashboardLayout from "./layouts/DashboardLayout"

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Layout Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/livestock" element={<Livestock />} />
          <Route path="/livestock/:id" element={<LivestockProfile />} />
          <Route path="/vaccinations" element={<Vaccinations />} />
          <Route path="/breeding" element={<Breeding />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
