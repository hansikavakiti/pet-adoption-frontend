import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {

        localStorage.removeItem("user");

        alert("Logged out successfully!");

        navigate("/login");
    };

    return (

        <nav>

            <div>

                <Link
                    to="/"
                    style={{
                        color: "white",
                        fontSize: "22px",
                        fontWeight: "bold"
                    }}
                >
                    🐾 Pet Adoption Portal
                </Link>

            </div>

            <div>

                <Link to="/">
                    Home
                </Link>

                <Link to="/pets">
                    Pets
                </Link>

                {!user && (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

                {user &&
                    user.role === "ADOPTER" && (
                        <Link to="/adopter-dashboard">
                            My Dashboard
                        </Link>
                    )}

                {user &&
                    user.role === "SHELTER" && (
                        <Link to="/shelter-dashboard">
                            Shelter Dashboard
                        </Link>
                    )}

                {user &&
                    user.role === "ADMIN" && (
                        <Link to="/admin-dashboard">
                            Admin Dashboard
                        </Link>
                    )}

                {user && (
                    <>
                        <span>
                            Welcome, {user.name}
                        </span>

                        <button
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;