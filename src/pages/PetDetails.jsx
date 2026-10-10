import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PetDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchPet();
    }, [id]);

    const fetchPet = async () => {

        try {

            const response = await fetch(
                `http://localhost:8080/pets/${id}`
            );

            if (!response.ok) {
                throw new Error("Pet not found");
            }

            const data = await response.json();

            setPet(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    const handleAdoptionRequest = async () => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user) {

            alert(
                "Please login before applying for adoption."
            );

            navigate("/login");

            return;
        }

        if (user.role !== "ADOPTER") {

            alert(
                "Only adopters can apply for adoption."
            );

            return;
        }

        if (!message.trim()) {

            alert(
                "Please enter a message."
            );

            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/adoption-requests",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        petId: pet.id,
                        adopterId: user.id,
                        message: message
                    })
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to submit adoption application"
                );

            }

            alert(
                "Adoption application submitted successfully!"
            );

            setMessage("");

        } catch (error) {

            console.error(error);

            alert(
                "Failed to submit adoption application."
            );

        }
    };

    if (loading) {

        return (
            <div className="pet-details">

                <h2>
                    Loading pet details...
                </h2>

            </div>
        );

    }

    if (!pet) {

        return (
            <div className="pet-details">

                <h2>
                    Pet not found.
                </h2>

                <button
                    onClick={() => navigate("/pets")}
                >
                    Back to Pets
                </button>

            </div>
        );

    }

    return (

        <div className="pet-details">

            <button
                onClick={() => navigate("/pets")}
            >
                ← Back to Pets
            </button>

            <br />
            <br />

            <div className="dashboard-card">

                <h1>
                    🐾 {pet.name}
                </h1>

                {/* PET IMAGE */}

                {pet.imageUrl ? (

                    <img
                        src={pet.imageUrl}
                        alt={pet.name}
                    />

                ) : (

                    <div
                        style={{
                            width: "350px",
                            maxWidth: "100%",
                            height: "250px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#eee",
                            borderRadius: "10px",
                            fontSize: "80px"
                        }}
                    >
                        🐾
                    </div>

                )}

                <hr />

                {/* PET INFORMATION */}

                <h2>
                    Pet Information
                </h2>

                <p>
                    <strong>
                        Animal Type:
                    </strong>{" "}
                    {pet.animalType}
                </p>

                <p>
                    <strong>
                        Breed:
                    </strong>{" "}
                    {pet.breed || "Not specified"}
                </p>

                <p>
                    <strong>
                        Age:
                    </strong>{" "}
                    {pet.age} years
                </p>

                <p>
                    <strong>
                        Gender:
                    </strong>{" "}
                    {pet.gender}
                </p>

                <p>
                    <strong>
                        Location:
                    </strong>{" "}
                    {pet.location}
                </p>

                <p>
                    <strong>
                        Status:
                    </strong>{" "}
                    {pet.status}
                </p>

                <p>
                    <strong>
                        Description:
                    </strong>{" "}
                    {pet.description ||
                        "No description available."}
                </p>

            </div>

            {/* ADOPTION SECTION */}

            {pet.status === "Available" && (

                <div className="dashboard-card">

                    <h2>
                        🏠 Apply for Adoption
                    </h2>

                    <p>
                        Tell the shelter why you would
                        like to adopt this pet.
                    </p>

                    <textarea
                        placeholder="Why would you like to adopt this pet?"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        rows="6"
                    />

                    <br />

                    <button
                        onClick={handleAdoptionRequest}
                    >
                        Apply for Adoption
                    </button>

                </div>

            )}

            {pet.status !== "Available" && (

                <div className="dashboard-card">

                    <h2>
                        This pet is not currently available
                    </h2>

                    <p>
                        You cannot submit an adoption
                        application for this pet.
                    </p>

                </div>

            )}

        </div>
    );
}

export default PetDetails;