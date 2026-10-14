import { useEffect, useState } from "react";

function AdminDashboard() {

    const [users, setUsers] = useState([]);
    const [shelters, setShelters] = useState([]);
    const [pets, setPets] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {

        fetchAdminData();

    }, []);

    const fetchAdminData = async () => {

        try {

            const [
                usersResponse,
                sheltersResponse,
                petsResponse,
                applicationsResponse
            ] = await Promise.all([

                fetch(
                    "${import.meta.env.VITE_API_BASE_URL}/admin/users"
                ),

                fetch(
                    "${import.meta.env.VITE_API_BASE_URL}/admin/shelters"
                ),

                fetch(
                    "${import.meta.env.VITE_API_BASE_URL}/admin/pets"
                ),

                fetch(
                    "${import.meta.env.VITE_API_BASE_URL}/admin/adoption-requests"
                )

            ]);

            const usersData =
                await usersResponse.json();

            const sheltersData =
                await sheltersResponse.json();

            const petsData =
                await petsResponse.json();

            const applicationsData =
                await applicationsResponse.json();

            setUsers(usersData);
            setShelters(sheltersData);
            setPets(petsData);
            setApplications(applicationsData);

        } catch (error) {

            console.error(error);

            alert(
                "Failed to load admin data."
            );

        } finally {

            setLoading(false);

        }
    };

    const deleteUser = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete user"
                );
            }

            alert("User deleted successfully!");

            fetchAdminData();

        } catch (error) {

            console.error(error);

            alert("Failed to delete user.");

        }
    };

    const deleteShelter = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this shelter?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/admin/shelters/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete shelter"
                );
            }

            alert(
                "Shelter deleted successfully!"
            );

            fetchAdminData();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to delete shelter."
            );

        }
    };

    const deletePet = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this pet?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/admin/pets/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete pet"
                );
            }

            alert("Pet deleted successfully!");

            fetchAdminData();

        } catch (error) {

            console.error(error);

            alert("Failed to delete pet.");

        }
    };

    const deleteApplication = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/admin/adoption-requests/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete application"
                );
            }

            alert(
                "Application deleted successfully!"
            );

            fetchAdminData();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to delete application."
            );

        }
    };

    const updateShelterStatus = async (
        id,
        status
    ) => {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/shelters/${id}/status?status=${status}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to update shelter"
                );
            }

            alert(
                `Shelter ${status.toLowerCase()} successfully!`
            );

            fetchAdminData();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to update shelter status."
            );

        }
    };

    const updateApplicationStatus = async (
        id,
        status
    ) => {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/adoption-requests/${id}/status?status=${status}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to update application"
                );
            }

            alert(
                `Application ${status.toLowerCase()} successfully!`
            );

            fetchAdminData();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to update application."
            );

        }
    };

    if (!user) {

        return (
            <div className="dashboard">

                <div className="dashboard-card">

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Please login to access the
                        admin dashboard.
                    </p>

                </div>

            </div>
        );

    }

    if (loading) {

        return (
            <div className="dashboard">

                <h2>
                    Loading admin dashboard...
                </h2>

            </div>
        );

    }

    return (

        <div className="dashboard">

            {/* HEADER */}

            <div className="dashboard-card">

                <h1>
                    🛠️ Admin Dashboard
                </h1>

                <h2>
                    Welcome, {user.name}!
                </h2>

                <p>
                    <strong>Email:</strong>{" "}
                    {user.email}
                </p>

                <p>
                    <strong>Role:</strong>{" "}
                    Administrator
                </p>

            </div>

            {/* STATISTICS */}

            <div className="stats-grid">

                <div className="stat-card">

                    <h3>
                        Users
                    </h3>

                    <h2>
                        {users.length}
                    </h2>

                </div>

                <div className="stat-card">

                    <h3>
                        Shelters
                    </h3>

                    <h2>
                        {shelters.length}
                    </h2>

                </div>

                <div className="stat-card">

                    <h3>
                        Pets
                    </h3>

                    <h2>
                        {pets.length}
                    </h2>

                </div>

                <div className="stat-card">

                    <h3>
                        Applications
                    </h3>

                    <h2>
                        {applications.length}
                    </h2>

                </div>

                <div className="stat-card">

                    <h3>
                        Pending Shelters
                    </h3>

                    <h2>
                        {
                            shelters.filter(
                                (shelter) =>
                                    shelter.approvalStatus ===
                                    "Pending"
                            ).length
                        }
                    </h2>

                </div>

                <div className="stat-card">

                    <h3>
                        Pending Applications
                    </h3>

                    <h2>
                        {
                            applications.filter(
                                (application) =>
                                    application.status ===
                                    "Pending"
                            ).length
                        }
                    </h2>

                </div>

            </div>

            {/* USERS */}

            <div className="dashboard-card">

                <h2>
                    👥 Manage Users
                </h2>

                {users.length === 0 ? (

                    <p>
                        No users found.
                    </p>

                ) : (

                    users.map((item) => (

                        <div
                            className="dashboard-card"
                            key={item.id}
                        >

                            <h3>
                                {item.name}
                            </h3>

                            <p>
                                <strong>
                                    Email:
                                </strong>{" "}
                                {item.email}
                            </p>

                            <p>
                                <strong>
                                    Role:
                                </strong>{" "}
                                {item.role}
                            </p>

                            <button
                                onClick={() =>
                                    deleteUser(item.id)
                                }
                            >
                                Delete User
                            </button>

                        </div>

                    ))

                )}

            </div>

            {/* SHELTERS */}

            <div className="dashboard-card">

                <h2>
                    🏠 Manage Shelters
                </h2>

                {shelters.length === 0 ? (

                    <p>
                        No shelters found.
                    </p>

                ) : (

                    shelters.map((shelter) => (

                        <div
                            className="dashboard-card"
                            key={shelter.id}
                        >

                            <h3>
                                {shelter.name}
                            </h3>

                            <p>
                                <strong>
                                    Email:
                                </strong>{" "}
                                {shelter.email}
                            </p>

                            <p>
                                <strong>
                                    Phone:
                                </strong>{" "}
                                {shelter.phone}
                            </p>

                            <p>
                                <strong>
                                    Address:
                                </strong>{" "}
                                {shelter.address}
                            </p>

                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}
                                {shelter.approvalStatus}
                            </p>

                            {shelter.approvalStatus ===
                                "Pending" && (

                                <>

                                    <button
                                        onClick={() =>
                                            updateShelterStatus(
                                                shelter.id,
                                                "Approved"
                                            )
                                        }
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateShelterStatus(
                                                shelter.id,
                                                "Rejected"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                </>

                            )}

                            <button
                                onClick={() =>
                                    deleteShelter(
                                        shelter.id
                                    )
                                }
                            >
                                Delete Shelter
                            </button>

                        </div>

                    ))

                )}

            </div>

            {/* PETS */}

            <div className="dashboard-card">

                <h2>
                    🐾 Manage Pets
                </h2>

                {pets.length === 0 ? (

                    <p>
                        No pets found.
                    </p>

                ) : (

                    pets.map((pet) => (

                        <div
                            className="dashboard-card"
                            key={pet.id}
                        >

                            <h3>
                                {pet.name}
                            </h3>

                            <p>
                                <strong>
                                    Animal:
                                </strong>{" "}
                                {pet.animalType}
                            </p>

                            <p>
                                <strong>
                                    Breed:
                                </strong>{" "}
                                {pet.breed ||
                                    "Not specified"}
                            </p>

                            <p>
                                <strong>
                                    Age:
                                </strong>{" "}
                                {pet.age}
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

                            <button
                                onClick={() =>
                                    deletePet(pet.id)
                                }
                            >
                                Delete Pet
                            </button>

                        </div>

                    ))

                )}

            </div>

            {/* APPLICATIONS */}

            <div className="dashboard-card">

                <h2>
                    📋 Manage Adoption Applications
                </h2>

                {applications.length === 0 ? (

                    <p>
                        No adoption applications found.
                    </p>

                ) : (

                    applications.map(
                        (application) => (

                            <div
                                className="dashboard-card"
                                key={application.id}
                            >

                                <h3>
                                    Application #
                                    {application.id}
                                </h3>

                                <p>
                                    <strong>
                                        Pet ID:
                                    </strong>{" "}
                                    {application.petId}
                                </p>

                                <p>
                                    <strong>
                                        Adopter ID:
                                    </strong>{" "}
                                    {application.adopterId}
                                </p>

                                <p>
                                    <strong>
                                        Message:
                                    </strong>{" "}
                                    {application.message}
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    {application.status}
                                </p>

                                {application.status ===
                                    "Pending" && (

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

                                <button
                                    onClick={() =>
                                        deleteApplication(
                                            application.id
                                        )
                                    }
                                >
                                    Delete Application
                                </button>

                            </div>

                        )
                    )

                )}

            </div>

        </div>
    );
}

export default AdminDashboard;