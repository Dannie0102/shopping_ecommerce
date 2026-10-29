import "./Cart.css";
import { useCart } from "../Context/CartContext";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const Cart = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>Your Cart Is Empty</h2>
        <p>Add some products before checking your cart.</p>

        <Link to="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }


  return (
    <div className="cart-page">
      <h1>
        <Link to="/" aria-label="Back to shop" className="back-link">
          <FaArrowLeft />
        </Link>
        Your Shopping Cart
      </h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              {item.image && (
                <img src={item.image} alt={item.name} className="cart-image" />
              )}

              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>{formatCurrency(item.price)}</p>

                <div className="quantity-controls">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>

              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <Link to="/checkout" className="checkout-button">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
