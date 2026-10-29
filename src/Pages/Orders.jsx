import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./Orders.css";

const API = "http://localhost:1000";
const STEPS = ["Confirmed", "Preparing", "On the way", "Delivered"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API}/orders?userId=${user.id}`);
        if (!response.ok) throw new Error("Can't fetch orders");
        const data = await response.json();
        // Newest first
        setOrders(
          [...data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          ),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user.id]);

  // DEMO ONLY: moves an order to its next status so you can see the tracker.
  // In a real app, the restaurant and rider update this, not the customer.
  const advanceStatus = async (order) => {
    const index = STEPS.indexOf(order.status);
    if (index === -1 || index === STEPS.length - 1) return;

    try {
      const response = await fetch(`${API}/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: STEPS[index + 1] }),
      });
      if (!response.ok) throw new Error("Update failed");
      const updated = await response.json();
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch {
      setError("Could not update the order status.");
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <p className="orders-status">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Your orders</h1>

      {error && (
        <p className="orders-status orders-error">
          {error}. Make sure JSON Server is running on port 1000.
        </p>
      )}

      {!error && orders.length === 0 && (
        <div className="orders-empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="orders-link">
            Browse the menu
          </Link>
        </div>
      )}

      <ul className="orders-list">
        {orders.map((order) => {
          const stepIndex = Math.max(STEPS.indexOf(order.status), 0);
          const delivered = stepIndex === STEPS.length - 1;
          const progress = (stepIndex / (STEPS.length - 1)) * 100;

          return (
            <li key={order.id} className="order-card">
              <div className="order-head">
                <div>
                  <h2>Order #{order.id}</h2>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`order-badge ${delivered ? "done" : ""}`}>
                  {STEPS[stepIndex]}
                </span>
              </div>

              <div className="order-bar">
                <span
                  className="order-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <ol className="order-steps">
                {STEPS.map((step, i) => (
                  <li
                    key={step}
                    className={
                      i < stepIndex ? "done" : i === stepIndex ? "current" : ""
                    }
                  >
                    {step}
                  </li>
                ))}
              </ol>

              <ul className="order-items">
                {(order.items || []).map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.quantity ?? item.qty} × {item.name}
                    </span>
                    <span>
                      {formatCurrency(item.price * (item.quantity ?? item.qty))}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="order-foot">
                <p>
                  {order.paymentMethod}
                  {order.customer?.address && ` · ${order.customer.address}`}
                </p>
                <strong>{formatCurrency(order.total)}</strong>
              </div>

              {!delivered && (
                <button
                  type="button"
                  className="order-demo"
                  onClick={() => advanceStatus(order)}
                >
                  Advance status (demo)
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Orders;
