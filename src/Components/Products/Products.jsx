import { useEffect, useState } from "react";
import "./Products.css";
import { useCart } from "../../Context/CartContext";
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const MENU_API = "http://localhost:1000/menu";

const Products = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(MENU_API);
        if (!response.ok) {
          throw new Error(`Can't fetch menu data`);
        }
        const data = await response.json();
        setMenu(data);
      } catch (err) {
        if (err) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading) {
    return (
      <section className="products">
        <p className="status-msg">Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products">
        <p className="status-msg status-error">
          Error: {error}. Make sure JSON Server is running on port 1000.
        </p>
      </section>
    );
  }

  if (menu.length === 0) {
    return (
      <section className="products">
        <p className="status-msg">No menu items yet.</p>
      </section>
    );
  }

  return (
    <section className="products">
      <div className="products-header">
        <h2>Explore the Menu</h2>
        <p>Freshly made, just for you</p>
      </div>

      <div className="product-grid">
        {menu.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-image">
              <img src={item.image} alt={item.name} loading="lazy" />
            </div>
            <div className="product-info">
              <h3>{item.name}</h3>
              <div className="product-footer">
                <span className="product-price">
                  {formatCurrency(item.price)}
                </span>
                <button onClick={() => addToCart(item)} className="product-btn">
                  Add +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
