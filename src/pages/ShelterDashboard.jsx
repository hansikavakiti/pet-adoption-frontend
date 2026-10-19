
import { useEffect, useState } from "react";

function ShelterDashboard() {
    const [shelter, setShelter] = useState(null);
    const [pets, setPets] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const emptyForm = {
        name: "",
        animalType: "Dog",
        breed: "",
        age: "",
        gender: "Male",
        location: "",
        imageUrl: "",
        description: "",
        status: "Available"
    };

    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (!user || user.role !== "SHELTER") {
            setLoading(false);
            return;
        }

        initializeShelter();
    }, []);

    // Load the shelter connected to the logged-in user.
    const initializeShelter = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/shelters/user/${user.id}`
            );

            if (!response.ok) {
                throw new Error("Unable to find your shelter profile.");
            }

            const shelterData = await response.json();

            if (!shelterData || !shelterData.id) {
                setShelter(null);
                return;
            }

            setShelter(shelterData);

            await Promise.all([
                fetchPets(shelterData.id),
                fetchApplications(shelterData.id)
            ]);
        } catch (error) {
            console.error(error);
            alert("Unable to load your shelter dashboard.");
        } finally {
            setLoading(false);
        }
    };

    // Load only this shelter's pets.
    const fetchPets = async (shelterId) => {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/pets`
        );

        if (!response.ok) {
            throw new Error("Failed to load pets.");
        }

        const data = await response.json();

        const myPets = data.filter(
            (pet) =>
                Number(pet.shelterId) === Number(shelterId)
        );

        setPets(myPets);
    };

    // Load applications submitted for this shelter's pets.
    const fetchApplications = async (shelterId) => {
        const [applicationsResponse, petsResponse] =
            await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/adoption-requests`),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/pets`)
            ]);

        if (!applicationsResponse.ok || !petsResponse.ok) {
            throw new Error("Failed to load applications.");
        }

        const allApplications =
            await applicationsResponse.json();

        const allPets = await petsResponse.json();

        const myPetIds = allPets
            .filter(
                (pet) =>
                    Number(pet.shelterId) === Number(shelterId)
            )
            .map((pet) => Number(pet.id));

        setApplications(
            allApplications.filter(
                (application) =>
                    myPetIds.includes(Number(application.petId))
            )
        );
    };

    const refreshDashboard = async () => {
        if (!shelter) return;

        try {
            await Promise.all([
                fetchPets(shelter.id),
                fetchApplications(shelter.id)
            ]);
        } catch (error) {
            console.error(error);
            alert("Unable to refresh dashboard data.");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Please select an image smaller than 5 MB.");
            e.target.value = "";
            return;
        }

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        if (!selectedImage) return formData.imageUrl;

        setUploadingImage(true);

        try {
            const data = new FormData();
            data.append("file", selectedImage);

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/images/upload`,
                {
                    method: "POST",
                    body: data
                }
            );

            const result = await response.json();

            if (!response.ok || !result.imageUrl) {
                throw new Error(result.error || "Image upload failed.");
            }

            return result.imageUrl;
        } finally {
            setUploadingImage(false);
        }
    
    };


    const resetForm = () => {
        setEditingPet(null);
        setFormData({ ...emptyForm });
        setSelectedImage(null);
        setImagePreview("");
    };

    // Add a new pet or update an existing pet.
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!shelter) {
            alert("Your shelter profile is not available.");
            return;
        }

        setSaving(true);

        try {
            const uploadedImageUrl = await uploadImage();

            const petData = {
                ...formData,
                imageUrl: uploadedImageUrl,
                age: Number(formData.age),
                shelterId: shelter.id
            };

            const url = editingPet
                ? `${import.meta.env.VITE_API_BASE_URL}/pets/${editingPet.id}`
                : `${import.meta.env.VITE_API_BASE_URL}/pets`;

            const response = await fetch(url, {
                method: editingPet ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(petData)
            });

            if (!response.ok) {
                throw new Error("Failed to save pet.");
            }

            alert(
                editingPet
                    ? "Pet updated successfully!"
                    : "Pet added successfully!"
            );

            resetForm();
            await refreshDashboard();
        } catch (error) {
            console.error(error);
            alert("Failed to save pet. Check the backend terminal.");
        } finally {
            setSaving(false);
        }
    };

    const editPet = (pet) => {
        setEditingPet(pet);

        setFormData({
            name: pet.name || "",
            animalType: pet.animalType || "Dog",
            breed: pet.breed || "",
            age: pet.age ?? "",
            gender: pet.gender || "Male",
            location: pet.location || "",
            imageUrl: pet.imageUrl || "",
            description: pet.description || "",
            status: pet.status || "Available"
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const deletePet = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pet?")) {
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/pets/${id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Failed to delete pet.");
            }

            alert("Pet deleted successfully!");

            if (editingPet?.id === id) {
                resetForm();
            }

            await refreshDashboard();
        } catch (error) {
            console.error(error);
            alert("Failed to delete pet.");
        }
    };

    // Approve or reject an adoption application.
    const updateApplicationStatus = async (id, status) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/adoption-requests/${id}/status?status=${status}`,
                { method: "PUT" }
            );

            if (!response.ok) {
                throw new Error("Failed to update application.");
            }

            alert(`Application ${status.toLowerCase()} successfully!`);
            await refreshDashboard();
        } catch (error) {
            console.error(error);
            alert("Failed to update application.");
        }
    };

    const totalPets = pets.length;

    const availablePets = pets.filter(
        (pet) => pet.status === "Available"
    ).length;

    const adoptedPets = pets.filter(
        (pet) => pet.status === "Adopted"
    ).length;

    const pendingApplications = applications.filter(
        (application) => application.status === "Pending"
    ).length;

    if (!user || user.role !== "SHELTER") {
        return (
            <div className="dashboard">
                <div className="dashboard-card">
                    <h1>🏠 Shelter Dashboard</h1>
                    <p>Please log in with a shelter account to continue.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="dashboard">
                <h2>Loading shelter dashboard...</h2>
            </div>
        );
    }

    if (!shelter) {
        return (
            <div className="dashboard">
                <div className="dashboard-card">
                    <h1>🏠 Shelter Profile Not Found</h1>
                    <p>
                        Your login account does not have a linked shelter
                        profile. Please check that shelter registration
                        completed successfully.
                    </p>
                    <button onClick={initializeShelter}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-card">
                <h1>🏠 Shelter Dashboard</h1>
                <h2>Welcome, {shelter.name || user.name}!</h2>
                <p><strong>Email:</strong> {shelter.email || user.email}</p>
                <p><strong>Address:</strong> {shelter.address || "Not provided"}</p>
                <p>
                    <strong>Approval status:</strong>{" "}
                    {shelter.approvalStatus || "Pending"}
                </p>
                {shelter.approvalStatus !== "Approved" && (
                    <p>
                        Your shelter is awaiting admin approval. You can
                        manage your listings in this demo, but public
                        shelter access should be restricted until approval.
                    </p>
                )}
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>My Pets</h3>
                    <h2>{totalPets}</h2>
                </div>

                <div className="stat-card">
                    <h3>Available</h3>
                    <h2>{availablePets}</h2>
                </div>

                <div className="stat-card">
                    <h3>Adopted</h3>
                    <h2>{adoptedPets}</h2>
                </div>

                <div className="stat-card">
                    <h3>Applications</h3>
                    <h2>{applications.length}</h2>
                </div>

                <div className="stat-card">
                    <h3>Pending</h3>
                    <h2>{pendingApplications}</h2>
                </div>
            </div>

            <div className="dashboard-card">
                <h2>{editingPet ? "✏️ Edit Pet" : "➕ Add New Pet"}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Pet Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Animal Type</label>
                        <select
                            name="animalType"
                            value={formData.animalType}
                            onChange={handleChange}
                        >
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Rabbit">Rabbit</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Breed</label>
                        <input
                            type="text"
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Age (years)</label>
                        <input
                            type="number"
                            name="age"
                            min="0"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    
                    <div className="form-group">
                        <label>Upload Pet Image</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {(imagePreview || formData.imageUrl) && (
                            <div style={{ marginTop: "12px" }}>
                                <img
                                    src={imagePreview || formData.imageUrl}
                                    alt="Pet preview"
                                    style={{
                                        width: "200px",
                                        height: "160px",
                                        objectFit: "cover",
                                        borderRadius: "12px",
                                        display: "block"
                                    }}
                                />
                            </div>
                        )}

                        {uploadingImage && <p>Uploading image...</p>}
                    </div>


                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Available">Available</option>
                            <option value="Adopted">Adopted</option>
                        </select>
                    </div>

                    <button type="submit" disabled={saving || uploadingImage}>
                        {uploadingImage
                            ? "Uploading Image..."
                            :  saving
                                ? "Saving..."
                                : editingPet
                                    ? "Update Pet"
                                    : "Add Pet"}
                    </button>

                    {editingPet && (
                        <button type="button" onClick={resetForm}>
                            Cancel Edit
                        </button>
                    )}
                </form>
            </div>

            <div className="dashboard-card">
                <h2>🐾 Manage My Pets</h2>

                {pets.length === 0 ? (
                    <p>You have not added any pets yet.</p>
                ) : (
                    pets.map((pet) => (
                        <div className="dashboard-card" key={pet.id}>
                            <h3>{pet.name}</h3>
                            <p><strong>Type:</strong> {pet.animalType}</p>
                            <p><strong>Breed:</strong> {pet.breed || "Not specified"}</p>
                            <p><strong>Age:</strong> {pet.age} years</p>
                            <p><strong>Location:</strong> {pet.location}</p>
                            <p><strong>Status:</strong> {pet.status}</p>

                            <button onClick={() => editPet(pet)}>
                                Edit
                            </button>

                            <button onClick={() => deletePet(pet.id)}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="dashboard-card">
                <h2>📋 Adoption Applications</h2>

                {applications.length === 0 ? (
                    <p>No applications have been submitted for your pets.</p>
                ) : (
                    applications.map((application) => (
                        <div
                            className="dashboard-card"
                            key={application.id}
                        >
                            <h3>Application #{application.id}</h3>
                            <p><strong>Pet ID:</strong> {application.petId}</p>
                            <p><strong>Adopter ID:</strong> {application.adopterId}</p>
                            <p><strong>Message:</strong> {application.message}</p>
                            <p><strong>Status:</strong> {application.status}</p>

                            {application.status === "Pending" && (
                                <>
                                    <button
                                        onClick={() =>
                                            updateApplicationStatus(
                                                application.id,
                                                "Approved"
                                            )
                                        }
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateApplicationStatus(
                                                application.id,
                                                "Rejected"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ShelterDashboard;