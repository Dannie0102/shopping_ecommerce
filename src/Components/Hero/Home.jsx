import { useState } from "react";
import "./Home.css";


const cuisines = [
  "Pizza",
  "Burgers",
  "Rice bowls",
  "Chicken",
  "Salads",
  "Desserts",
];
const steps = ["Confirmed", "Preparing", "On the way", "Delivered"];
const currentStep = 2; // index of the active step

const Home = () => {
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    // TODO: navigate to the restaurants page with this address
    console.log("Searching near:", address);
  };

  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <h1>Hot food at your door in 30 minutes.</h1>
        <p className="hero-sub">
          Order from restaurants near you and track your delivery live.
        </p>

        <form className="hero-search" onSubmit={handleSubmit}>
          <label htmlFor="address" className="sr-only">
            Delivery address
          </label>
          <input
            id="address"
            type="text"
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="submit">Find food</button>
        </form>

        <ul className="hero-cuisines" aria-label="Popular categories">
          {cuisines.map((c) => (
            <li key={c}>
              <a href="#">{c}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="hero-panel" aria-hidden="true">
        <div className="tracker">
          <p className="tracker-eta">12 min</p>
          <p className="tracker-label">until your order arrives</p>

          <div className="tracker-bar">
            <span
              className="tracker-fill"
              style={{
                "--progress": `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          <ol className="tracker-steps">
            {steps.map((s, i) => (
              <li
                key={s}
                className={
                  i < currentStep ? "done" : i === currentStep ? "current" : ""
                }
              >
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Home;
