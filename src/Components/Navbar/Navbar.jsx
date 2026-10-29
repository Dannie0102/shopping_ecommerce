import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
// import { Link as ScrollLink } from "react-scroll";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <h2>FoodDelivery</h2>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/cart">Cart</NavLink>
        </li>
        <li>
          <NavLink to="/account">Account</NavLink>
        </li>
        <li>
          <NavLink to="/orders">Orders</NavLink>
        </li>

        <li>
          {user ? (
            <button type="button" className="nav-logout" onClick={logout}>
              Log out
            </button>
          ) : (
            <NavLink to="/login">Log in</NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
