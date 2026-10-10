import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pets from "./pages/Pets";
import PetDetails from "./pages/PetDetails";

import AdopterDashboard
    from "./pages/AdopterDashboard";

import ShelterDashboard
    from "./pages/ShelterDashboard";

import AdminDashboard
    from "./pages/AdminDashboard";

import Navbar
    from "./components/Navbar";

import ProtectedRoute
    from "./components/ProtectedRoute";


function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Public Pages */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/pets"
                    element={<Pets />}
                />

                <Route
                    path="/pets/:id"
                    element={<PetDetails />}
                />


                {/* Adopter Dashboard */}

                <Route
                    path="/adopter-dashboard"
                    element={
                        <ProtectedRoute
                            allowedRole="ADOPTER"
                        >
                            <AdopterDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Shelter Dashboard */}

                <Route
                    path="/shelter-dashboard"
                    element={
                        <ProtectedRoute
                            allowedRole="SHELTER"
                        >
                            <ShelterDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Admin Dashboard */}

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute
                            allowedRole="ADMIN"
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;