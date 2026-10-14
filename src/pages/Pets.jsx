import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Pets() {

    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);

    const [search, setSearch] = useState("");
    const [animalType, setAnimalType] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [location, setLocation] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/pets`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch pets");
            }

            const data = await response.json();

            // Show only available pets
            const availablePets = data.filter(
                (pet) => pet.status === "Available"
            );

            setPets(availablePets);
            setFilteredPets(availablePets);

        } catch (error) {

            console.error(error);
            alert("Unable to load pets.");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        let result = [...pets];

        // Search by name or breed
        if (search.trim() !== "") {

            const searchText = search.toLowerCase();

            result = result.filter((pet) =>

                (pet.name || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (pet.breed || "")
                    .toLowerCase()
                    .includes(searchText)

            );
        }

        // Filter by animal type
        if (animalType !== "") {

            result = result.filter(
                (pet) =>
                    (pet.animalType || "").toLowerCase()
                    === animalType.toLowerCase()
            );

        }

        // Filter by gender
        if (gender !== "") {

            result = result.filter(
                (pet) =>
                    (pet.gender || "").toLowerCase()
                    === gender.toLowerCase()
            );

        }

        // Filter by age
        if (age !== "") {

            const maxAge = Number(age);

            result = result.filter(
                (pet) => Number(pet.age) <= maxAge
            );

        }

        // Filter by location
        if (location.trim() !== "") {

            const locationText = location.toLowerCase();

            result = result.filter(
                (pet) =>
                    (pet.location || "")
                        .toLowerCase()
                        .includes(locationText)
            );

        }

        setFilteredPets(result);

    }, [
        search,
        animalType,
        gender,
        age,
        location,
        pets
    ]);

    const clearFilters = () => {

        setSearch("");
        setAnimalType("");
        setGender("");
        setAge("");
        setLocation("");

    };

    if (loading) {

        return (
            <div className="pets-page">

                <h1>Available Pets</h1>

                <p>Loading pets...</p>

            </div>
        );

    }

    return (

        <div className="pets-page">

            <h1>🐾 Available Pets</h1>

            <p>
                Find a loving companion waiting for a forever home.
            </p>

            {/* FILTER SECTION */}

            <div className="filter-box">

                <h2>Search & Filter Pets</h2>

                <input
                    type="text"
                    placeholder="Search by name or breed"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    value={animalType}
                    onChange={(e) =>
                        setAnimalType(e.target.value)
                    }
                >

                    <option value="">
                        All Animal Types
                    </option>

                    <option value="Dog">
                        Dog
                    </option>

                    <option value="Cat">
                        Cat
                    </option>

                    <option value="Bird">
                        Bird
                    </option>

                    <option value="Rabbit">
                        Rabbit
                    </option>

                </select>

                <select
                    value={gender}
                    onChange={(e) =>
                        setGender(e.target.value)
                    }
                >

                    <option value="">
                        All Genders
                    </option>

                    <option value="Male">
                        Male
                    </option>

                    <option value="Female">
                        Female
                    </option>

                </select>

                <select
                    value={age}
                    onChange={(e) =>
                        setAge(e.target.value)
                    }
                >

                    <option value="">
                        Any Age
                    </option>

                    <option value="1">
                        Up to 1 year
                    </option>

                    <option value="3">
                        Up to 3 years
                    </option>

                    <option value="5">
                        Up to 5 years
                    </option>

                    <option value="10">
                        Up to 10 years
                    </option>

                </select>

                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) =>
                        setLocation(e.target.value)
                    }
                />

                <br />

                <button onClick={clearFilters}>
                    Clear Filters
                </button>

            </div>

            {/* RESULTS */}

            <h2>
                {filteredPets.length}{" "}
                {filteredPets.length === 1
                    ? "Pet"
                    : "Pets"}{" "}
                Found
            </h2>

            {filteredPets.length === 0 ? (

                <div className="dashboard-card">

                    <h3>No pets found</h3>

                    <p>
                        Try changing your search or filters.
                    </p>

                </div>

            ) : (

                <div className="pet-grid">

                    {filteredPets.map((pet) => (

                        <div
                            className="pet-card"
                            key={pet.id}
                        >

                            {/* PET IMAGE */}

                            {pet.imageUrl ? (

                                <img
                                    src={pet.imageUrl}
                                    alt={pet.name}
                                />

                            ) : (

                                <div
                                    style={{
                                        height: "200px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#eee",
                                        borderRadius: "8px",
                                        fontSize: "60px"
                                    }}
                                >
                                    🐾
                                </div>

                            )}

                            {/* PET DETAILS */}

                            <h2>
                                {pet.name}
                            </h2>

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

                            <Link
                                to={`/pets/${pet.id}`}
                            >
                                View Details →
                            </Link>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Pets;