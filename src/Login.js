import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NetworkStatus from "./NetworkStatus";
import VodafoneLogo from "./vodafone.svg";
import "./App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address.";

    if (!password) newErrors.password = "Password is required.";
    else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) newErrors.password = "Password must contain at least one special character.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="container">
        <NetworkStatus />
        <img src={VodafoneLogo} className="logo" alt="vodafone" />
        <h1>Physical Asset Verification</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label>Email ID</label>
            <input
              type="text"
              value={email}
              placeholder="Enter your Vodafone email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button type="submit" className="submit-btn my-3">
            Use your Vodafone credentials
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
