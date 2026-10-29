import { useEffect, useState } from "react";
import "./Restaurants.css";

const API_URL = "http://localhost:1000";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/restaurants`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => setRestaurants(data))
      .catch(() =>
        setError(
          'Could not load restaurants. Make sure the API is running with "npm run api".',
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="restaurants">
      <h2>Restaurants</h2>

      {loading && <p className="status">Loading restaurants...</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && restaurants.length === 0 && (
        <p className="status">No restaurants available right now.</p>
      )}

      <ul className="restaurant-grid">
        {restaurants.map((r) => (
          <li key={r.id} className="restaurant-card">
            <div className="restaurant-image">
              <img
                src={r.image}
                alt={r.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="restaurant-info">
              <div className="restaurant-top">
                <h3>{r.name}</h3>
                <span className="rating">{r.rating.toFixed(1)}</span>
              </div>

              <p className="cuisine">{r.cuisine}</p>

              <p className="meta">
                {r.deliveryTime} min · {formatCurrency}
                {r.deliveryFee} delivery
              </p>

              <button type="button">View menu</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Restaurants;
