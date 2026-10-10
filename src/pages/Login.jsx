import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8080/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {

                alert(
                    "Invalid email or password."
                );

                return;
            }

            const user = await response.json();

            if (!user) {

                alert(
                    "Invalid email or password."
                );

                return;
            }

            // Save logged-in user
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            alert("Login successful!");

            // Redirect according to role

            if (user.role === "ADOPTER") {

                navigate("/adopter-dashboard");

            } else if (user.role === "SHELTER") {

                navigate("/shelter-dashboard");

            } else if (user.role === "ADMIN") {

                navigate("/admin-dashboard");

            } else {

                navigate("/");

            }

        } catch (error) {

            console.error(error);

            alert(
                "Cannot connect to the backend. " +
                "Make sure Spring Boot is running."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="form-container">

            <h1>
                🔐 Login
            </h1>

            <p
                style={{
                    textAlign: "center",
                    color: "#666"
                }}
            >
                Login to your Pet Adoption Portal
                account.
            </p>

            <form onSubmit={handleSubmit}>

                {/* EMAIL */}

                <div className="form-group">

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                </div>

                {/* PASSWORD */}

                <div className="form-group">

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                </div>

                {/* LOGIN BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Logging in..."
                        : "Login"}

                </button>

            </form>

            <p
                style={{
                    textAlign: "center",
                    marginTop: "20px"
                }}
            >

                Don't have an account?{" "}

                <Link to="/register">
                    Create an account
                </Link>

            </p>

        </div>
    );
}

export default Login;