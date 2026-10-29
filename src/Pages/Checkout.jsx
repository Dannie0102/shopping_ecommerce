import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import "./Checkout.css";

const ORDERS_API = "http://localhost:1000/orders";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    notes: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(ORDERS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          customer: form,
          items: cartItems.map(({ id, name, price, quantity }) => ({
            id,
            name,
            price,
            quantity,
          })),
          total: cartTotal,
          paymentMethod: "Pay on delivery",
          status: "Confirmed",
          createdAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Request failed");

      const order = await response.json();
      setOrderId(order.id);
      clearCart();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  // Order placed: this must come before the empty-cart check,
  // because clearCart() empties the cart on success.
  if (status === "success") {
    return (
      <div className="checkout-page checkout-message">
        <h1>Order placed</h1>
        <p>
          Thank you, {form.name}. Your order #{orderId} is confirmed and will be
          delivered to {form.address}.
        </p>
        <Link to="/" className="checkout-link">
          Back to menu
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page checkout-message">
        <h1>Nothing to check out</h1>
        <p>Your cart is empty.</p>
        <Link to="/" className="checkout-link">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Delivery details</legend>

            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
            />

            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={handleChange}
            />

            <label htmlFor="address">Delivery address</label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              required
              value={form.address}
              onChange={handleChange}
            />

            <label htmlFor="notes">Notes for the rider (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={form.notes}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset>
            <legend>Payment</legend>

            <label className="pay-option">
              <input type="radio" name="payment" defaultChecked />
              Pay on delivery
            </label>
            <label className="pay-option disabled">
              <input type="radio" name="payment" disabled />
              Pay online (coming soon)
            </label>
          </fieldset>

          {status === "error" && (
            <p className="checkout-error">
              Could not place your order. Make sure the API is running and try
              again.
            </p>
          )}

          <button
            type="submit"
            className="checkout-submit"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Placing order..."
              : `Place order · ${formatCurrency(cartTotal)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="checkout-total">
            <span>Total</span>
            <strong>{formatCurrency(cartTotal)}</strong>
          </div>
          <Link to="/cart" className="checkout-edit">
            Edit cart
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
