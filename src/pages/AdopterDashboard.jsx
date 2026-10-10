import { useEffect, useState } from "react";

function AdopterDashboard() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {

        if (user) {
            fetchApplications();
        } else {
            setLoading(false);
        }

    }, []);

    const fetchApplications = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/adoption-requests"
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch applications"
                );
            }

            const data = await response.json();

            const myApplications = data.filter(
                (application) =>
                    application.adopterId === user.id
            );

            setApplications(myApplications);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    if (!user) {

        return (
            <div className="dashboard">

                <div className="dashboard-card">

                    <h1>
                        Adopter Dashboard
                    </h1>

                    <p>
                        Please login to view your dashboard.
                    </p>

                </div>

            </div>
        );

    }

    if (loading) {

        return (
            <div className="dashboard">

                <h2>
                    Loading your applications...
                </h2>

            </div>
        );

    }

    return (

        <div className="dashboard">

            {/* HEADER */}

            <div className="dashboard-card">

                <h1>
                    🐾 Adopter Dashboard
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
                    Adopter
                </p>

            </div>

            {/* STATISTICS */}

            <div className="stats-grid">

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
                        Pending
                    </h3>

                    <h2>
                        {
                            applications.filter(
                                (app) =>
                                    app.status === "Pending"
                            ).length
                        }
                    </h2>

                </div>

                <div className="stat-card">

                    <h3>
                        Approved
                    </h3>

                    <h2>
                        {
                            applications.filter(
                                (app) =>
                                    app.status === "Approved"
                            ).length
                        }
                    </h2>

                </div>

                <div className="stat-card">

                    <h3>
                        Rejected
                    </h3>

                    <h2>
                        {
                            applications.filter(
                                (app) =>
                                    app.status === "Rejected"
                            ).length
                        }
                    </h2>

                </div>

            </div>

            {/* APPLICATIONS */}

            <div className="dashboard-card">

                <h2>
                    📋 My Adoption Applications
                </h2>

                {applications.length === 0 ? (

                    <div>

                        <p>
                            You have not submitted any
                            adoption applications yet.
                        </p>

                        <a href="/pets">
                            Browse Available Pets →
                        </a>

                    </div>

                ) : (

                    <div>

                        {applications.map(
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

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdopterDashboard;