
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const [pets, setPets] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8080/pets")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load pets");
                }
                return response.json();
            })
            .then((data) => {
                setPets(
                    data.filter((pet) => pet.status === "Available")
                );
            })
            .catch((error) => {
                console.error("Unable to load pets:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();

        navigate(
            `/pets?search=${encodeURIComponent(search.trim())}`
        );
    };

    const featuredPets = pets.slice(0, 4);

    return (
        <main className="home-page">

            {/* HERO */}
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-badge">
                        🐾 EVERY PET DESERVES LOVE
                    </span>

                    <h1>
                        Find your new
                        <br />
                        <span>best friend.</span>
                    </h1>

                    <p className="hero-description">
                        Some friendships change your life.
                        Meet adorable pets waiting for a loving home
                        and make room for a lifetime of happiness.
                    </p>

                    <div className="hero-actions">
                        <Link to="/pets" className="btn btn-primary">
                            Meet Your Match →
                        </Link>

                        <Link to="/register" className="btn btn-secondary">
                            Create Account
                        </Link>
                    </div>

                    <div className="hero-note">
                        ❤️ Adopt with love. Change a life.
                    </div>

                    <div className="hero-stats">
                        <div>
                            <strong>Love</strong>
                            <span>Without limits</span>
                        </div>
                        <div>
                            <strong>Care</strong>
                            <span>Every single day</span>
                        </div>
                        <div>
                            <strong>Home</strong>
                            <span>Forever starts here</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <img
                        className="hero-image"
                        src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1100&q=85"
                        alt="Happy pets enjoying time together"
                    />

                    <div className="hero-floating-card">
                        <span className="floating-icon">🐶</span>
                        <div>
                            <strong>Your forever friend</strong>
                            <p>A beautiful friendship begins here.</p>
                        </div>
                    </div>

                    <div className="hero-heart">♥</div>
                </div>
            </section>

            {/* SEARCH */}
            <section className="home-search-section">
                <div className="section-eyebrow">YOUR FUTURE FAMILY</div>

                <h2>Let's find your perfect match</h2>

                <p>
                    Search for a companion who fits your life.
                </p>

                <form className="home-search" onSubmit={handleSearch}>
                    <span className="search-icon">⌕</span>

                    <input
                        type="search"
                        placeholder="Search by pet name, breed or location..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        aria-label="Search pets"
                    />

                    <button type="submit" className="btn btn-primary">
                        Find Pets
                    </button>
                </form>

                <div className="search-suggestions">
                    <span>Popular:</span>
                    <button type="button" onClick={() => navigate("/pets?search=Dog")}>
                        Dogs
                    </button>
                    <button type="button" onClick={() => navigate("/pets?search=Cat")}>
                        Cats
                    </button>
                    <button type="button" onClick={() => navigate("/pets?search=Rabbit")}>
                        Rabbits
                    </button>
                </div>
            </section>

            {/* FEATURED PETS */}
            <section className="featured-section">
                <div className="section-heading">
                    <div>
                        <div className="section-eyebrow">
                            MEET YOUR NEW FAMILY
                        </div>
                        <h2>Pets waiting for you</h2>
                        <p>
                            These lovely faces are looking for a place to call home.
                        </p>
                    </div>

                    <Link to="/pets" className="text-link">
                        View all pets →
                    </Link>
                </div>

                {loading ? (
                    <div className="empty-message">
                        <div className="empty-icon">🐾</div>
                        <h3>Finding your future best friends...</h3>
                    </div>
                ) : featuredPets.length === 0 ? (
                    <div className="empty-message">
                        <div className="empty-icon">🐾</div>
                        <h3>New friends are on their way!</h3>
                        <p>
                            There are no available pets to feature right now.
                            Please visit again soon.
                        </p>
                        <Link to="/pets" className="btn btn-primary">
                            Explore Pets
                        </Link>
                    </div>
                ) : (
                    <div className="featured-grid">
                        {featuredPets.map((pet) => (
                            <article className="pet-card" key={pet.id}>
                                {pet.imageUrl ? (
                                    <img
                                        className="pet-card-image"
                                        src={pet.imageUrl}
                                        alt={pet.name}
                                        onError={(event) => {
                                            event.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="pet-card-placeholder">
                                        🐾
                                    </div>
                                )}

                                <div className="pet-card-content">
                                    <span className="availability-badge">
                                        ● Available for adoption
                                    </span>

                                    <h3>{pet.name}</h3>

                                    <p className="pet-breed">
                                        {pet.breed || pet.animalType}
                                    </p>

                                    <div className="pet-meta">
                                        <span>🎂 {pet.age} years</span>
                                        <span>📍 {pet.location || "Location not specified"}</span>
                                        <span>🐾 {pet.gender || "Not specified"}</span>
                                    </div>

                                    <Link
                                        to={`/pets/${pet.id}`}
                                        className="pet-card-link"
                                    >
                                        Meet {pet.name} →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className="center-action">
                    <Link to="/pets" className="btn btn-outline">
                        Discover All Pets →
                    </Link>
                </div>
            </section>

            {/* BENEFITS */}
            <section className="benefits-section">
                <div className="section-title-center">
                    <div className="section-eyebrow">WHY ADOPT WITH US?</div>
                    <h2>A little love changes everything</h2>
                    <p>
                        Making the journey from searching to adoption easier.
                    </p>
                </div>

                <div className="benefits-grid">
                    <article className="benefit-card">
                        <div className="benefit-icon green">🏡</div>
                        <h3>Find Your Companion</h3>
                        <p>
                            Browse available pets and discover the one
                            that feels right for your family.
                        </p>
                    </article>

                    <article className="benefit-card">
                        <div className="benefit-icon peach">💌</div>
                        <h3>Easy Applications</h3>
                        <p>
                            Send an adoption request online and tell
                            the shelter why you want to adopt.
                        </p>
                    </article>

                    <article className="benefit-card">
                        <div className="benefit-icon lavender">📋</div>
                        <h3>Track Your Requests</h3>
                        <p>
                            Use your adopter dashboard to follow
                            your application status.
                        </p>
                    </article>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="how-section">
                <div className="section-title-center">
                    <div className="section-eyebrow">SIMPLE AND MEANINGFUL</div>
                    <h2>Three steps to a lifetime of love</h2>
                    <p>Your next best friend could be closer than you think.</p>
                </div>

                <div className="steps-grid">
                    <article className="step-card">
                        <span className="step-number">01</span>
                        <div className="step-icon">🔎</div>
                        <h3>Find your match</h3>
                        <p>
                            Explore the pets and find a companion
                            that matches your lifestyle.
                        </p>
                    </article>

                    <article className="step-card">
                        <span className="step-number">02</span>
                        <div className="step-icon">💚</div>
                        <h3>Apply to adopt</h3>
                        <p>
                            Log in, share your message and send
                            your adoption application.
                        </p>
                    </article>

                    <article className="step-card">
                        <span className="step-number">03</span>
                        <div className="step-icon">🏡</div>
                        <h3>Welcome them home</h3>
                        <p>
                            Follow your application and get ready
                            for a wonderful new chapter.
                        </p>
                    </article>
                </div>
            </section>

            {/* SHELTER CTA */}
            <section className="shelter-cta-section">
                <div className="shelter-cta">
                    <div className="shelter-cta-icon">🐕</div>
                    <div className="shelter-cta-content">
                        <div className="section-eyebrow">
                            FOR ANIMAL SHELTERS
                        </div>
                        <h2>Help your pets find their forever homes</h2>
                        <p>
                            Join our community, list pets looking for homes,
                            and manage adoption applications in one place.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => navigate("/register")}
                    >
                        Join as a Shelter →
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="home-footer">
                <div className="footer-brand">
                    <span>🐾</span>
                    Pet Adoption Portal
                </div>

                <p>
                    More wagging tails. More happy homes. More love.
                </p>

                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/pets">Find Pets</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </div>

                <div className="footer-bottom">
                    © {new Date().getFullYear()} Pet Adoption Portal · Made with ❤️ for pets
                </div>
            </footer>

        </main>
    );
}

export default Home;