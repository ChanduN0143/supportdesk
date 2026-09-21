
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(
        email.trim(),
        password
      );

      login(data);

      if (data.user.role === "agent") {
        navigate("/agent-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT SIDE */}

        <div className="auth-info">

          <Link to="/" className="auth-logo">
            Support<span>Desk</span>
          </Link>

          <div className="auth-info-content">

            <div className="auth-eyebrow">
              CUSTOMER SUPPORT PLATFORM
            </div>

            <h1>
              Support that keeps
              <span> moving.</span>
            </h1>

            <p>
              Manage customer conversations, support tickets,
              assignments, and SLA deadlines from one reliable
              workspace.
            </p>

            <div className="auth-features">

              <div className="auth-feature">
                <div className="auth-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>Centralized ticket management</strong>
                  <p>
                    Create, track, and manage support requests
                    from one place.
                  </p>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>SLA monitoring</strong>
                  <p>
                    Keep track of deadlines and identify
                    breached tickets quickly.
                  </p>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>Customer communication</strong>
                  <p>
                    Keep conversations connected to each
                    support ticket.
                  </p>
                </div>
              </div>

            </div>

          </div>

          <div className="auth-info-footer">
            Secure support operations. Simple workflow.
          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="auth-form-section">

          <div className="auth-form">

            <div className="mobile-logo">

              <Link to="/" className="auth-logo">
                Support<span>Desk</span>
              </Link>

            </div>

            <div className="auth-form-heading">

              <div className="auth-form-label">
                ACCOUNT ACCESS
              </div>

              <h2>Welcome back</h2>

              <p className="auth-subtitle">
                Sign in to continue to your SupportDesk workspace.
              </p>

            </div>


            {/* LOGIN FORM */}

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label htmlFor="login-email">
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  required
                  disabled={loading}
                />

              </div>


              <div className="form-group">

                <div className="password-label">

                  <label htmlFor="login-password">
                    Password
                  </label>

                  <span className="forgot-password">
                    Forgot password?
                  </span>

                </div>

                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

              </div>


              {/* ERROR */}

              {error && (
                <div className="auth-error">

                  <span className="auth-error-icon">
                    !
                  </span>

                  <div>
                    <strong>Sign in failed</strong>
                    <p>{error}</p>
                  </div>

                </div>
              )}


              {/* BUTTON */}

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="auth-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In →"
                )}

              </button>

            </form>


            {/* REGISTER */}

            <div className="auth-divider">
              <span>New to SupportDesk?</span>
            </div>

            <Link
              to="/register"
              className="auth-create-account"
            >
              Create an account
              <span>→</span>
            </Link>


            <p className="auth-security-note">
              Your account credentials are securely
              authenticated before access is granted.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
