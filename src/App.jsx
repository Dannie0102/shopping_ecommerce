import { Route, Routes } from "react-router-dom";

import Home from "./Components/Hero/Home";
import Navbar from "./Components/Navbar/Navbar";
import Products from "./Components/Products/Products";
import Restaurants from "./Components/Restaurants/Restaurants";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import Login from "./Pages/Login";
import ProtectedRoute from './Components/ProtectedRoute';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Restaurants />
              <Products />
            </>
          }
        />
        <Route path="cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
