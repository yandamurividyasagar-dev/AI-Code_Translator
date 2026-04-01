import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import { AuthContext } from "../context/AuthContext.jsx";
import { register, emailLogin, googleLogin } from "../services/authService.js";

import "../styles/login.css";

const features = [
  { icon: "</>", title: "Code Translation", desc: "Translate between languages" },
  { icon: "Cx", title: "Complexity Analysis", desc: "Time & space complexity" },
  { icon: "#", title: "AI Optimization", desc: "Improve performance" },
  { icon: "?", title: "Code Explanation", desc: "Understand code easily" },
];

function LoginPage() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) return toast.error("Fill all fields");
    if (isSignUp && !name) return toast.error("Enter name");

    setLoading(true);

    try {
      const result = isSignUp
        ? await register(name, email, password)
        : await emailLogin(email, password);

      login(result.token, result.user);

      toast.success("Success!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      const result = await googleLogin(res.credential);
      login(result.token, result.user);
      toast.success("Google login success");
      navigate("/");
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div>
          <div className="login-logo">
            <div className="login-logo-icon">{`</>`}</div>
            <span className="login-logo-text">CodeTranslator</span>
          </div>

          <h1 className="login-hero-title">
            Translate, Analyze & Optimize Code
          </h1>

          <p className="login-hero-subtitle">
            AI-powered tool for developers to work across languages.
          </p>

          <div className="login-features">
            {features.map((f, i) => (
              <div key={i} className="login-feature-card">
                <div className="login-feature-icon">{f.icon}</div>
                <div>
                  <div className="login-feature-title">{f.title}</div>
                  <div className="login-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-form">
          <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                type="text"
                className="login-input"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-submit-btn" disabled={loading}>
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="login-toggle">
            {isSignUp ? "Already have account?" : "New here?"}
            <button
              className="login-toggle-btn"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Create account"}
            </button>
          </p>

          <div className="login-divider">
            <span>or</span>
          </div>

          <div className="login-google-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;