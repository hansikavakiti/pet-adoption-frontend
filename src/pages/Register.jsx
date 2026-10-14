
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ADOPTER",
        phone: "",
        address: ""
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
            const userResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        role: formData.role
                    })
                }
            );

            if (!userResponse.ok) {
                throw new Error("User registration failed");
            }

            const user = await userResponse.json();

            if (formData.role === "SHELTER") {
                const shelterResponse = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/shelters`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            address: formData.address,
                            userId: user.id
                        })
                    }
                );

                if (!shelterResponse.ok) {
                    throw new Error(
                        "Account created, but shelter registration failed. Contact the administrator."
                    );
                }
            }

            alert(
                formData.role === "SHELTER"
                    ? "Shelter registration successful! Your shelter is pending admin approval."
                    : "Registration successful! Please login."
            );

            navigate("/login");

        } catch (error) {
            console.error(error);
            alert(error.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h1>🐾 Create Account</h1>

            <p style={{ textAlign: "center", color: "#666" }}>
                Join the Pet Adoption Portal
            </p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name / Shelter Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength="6"
                        placeholder="Create a password"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Register As</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="ADOPTER">Adopter</option>
                        <option value="SHELTER">Shelter</option>
                    </select>
                </div>

                {formData.role === "SHELTER" && (
                    <>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Shelter Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter shelter address"
                                rows="3"
                                required
                            />
                        </div>
                    </>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "20px" }}>
                Already have an account?{" "}
                <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default Register;