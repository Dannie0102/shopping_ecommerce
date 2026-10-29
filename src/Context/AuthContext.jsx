import { createContext, useContext, useState } from "react";

const API = "http://localhost:1000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // Only id, name and email are kept in the browser, never the password
  const saveUser = (nextUser) => {
    setUser(nextUser);
    try {
      if (nextUser) localStorage.setItem("user", JSON.stringify(nextUser));
      else localStorage.removeItem("user");
    } catch {
      // storage unavailable, login still works for this session
    }
  };

  const register = async (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    const existing = await fetch(
      `${API}/users?email=${encodeURIComponent(cleanEmail)}`,
    );
    if (!existing.ok) throw new Error("Could not reach the server");
    if ((await existing.json()).length > 0) {
      throw new Error("An account with this email already exists");
    }

    const response = await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: cleanEmail, password }),
    });
    if (!response.ok) throw new Error("Could not create your account");

    const created = await response.json();
    saveUser({ id: created.id, name: created.name, email: created.email });
  };

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    const response = await fetch(
      `${API}/users?email=${encodeURIComponent(cleanEmail)}&password=${encodeURIComponent(password)}`,
    );
    if (!response.ok) throw new Error("Could not reach the server");

    const matches = await response.json();
    if (matches.length === 0) throw new Error("Wrong email or password");

    const found = matches[0];
    saveUser({ id: found.id, name: found.name, email: found.email });
  };

  const logout = () => saveUser(null);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
