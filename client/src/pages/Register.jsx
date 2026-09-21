import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(
        name.trim(),
        email.trim(),
        password
      );

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
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
              Start managing
              <span> support better.</span>
            </h1>

            <p>
              Create your SupportDesk account and bring your
              customer support operations into one organized
              workspace.
            </p>

            <div className="auth-features">

              <div className="auth-feature">

                <div className="auth-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>Organize support requests</strong>

                  <p>
                    Create and track customer support
                    tickets efficiently.
                  </p>
                </div>

              </div>


              <div className="auth-feature">

                <div className="auth-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>Monitor SLA performance</strong>

                  <p>
                    Keep support deadlines visible and
                    track ticket progress.
                  </p>
                </div>

              </div>


              <div className="auth-feature">

                <div className="auth-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>Stay connected</strong>

                  <p>
                    Keep customer conversations linked
                    to their support requests.
                  </p>
                </div>

              </div>

            </div>

          </div>

          <div className="auth-info-footer">
            Simple workflow. Organized support.
          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="auth-form-section">

          <div className="auth-form">

            {/* MOBILE LOGO */}

            <div className="mobile-logo">

              <Link to="/" className="auth-logo">
                Support<span>Desk</span>
              </Link>

            </div>


            {/* HEADING */}

            <div className="auth-form-heading">

              <div className="auth-form-label">
                GET STARTED
              </div>

              <h2>Create your account</h2>

              <p className="auth-subtitle">
                Set up your SupportDesk account to get started.
              </p>

            </div>


            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="form-group">

                <label htmlFor="register-name">
                  Full name
                </label>

                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  autoComplete="name"
                  maxLength="100"
                  required
                  disabled={loading}
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="register-email">
                  Email address
                </label>

                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  maxLength="150"
                  required
                  disabled={loading}
                />

              </div>


              {/* PASSWORD */}

              <div className="form-group">

                <label htmlFor="register-password">
                  Password
                </label>

                <input
                  id="register-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  minLength="6"
                  required
                  disabled={loading}
                />

                <small>
                  Use at least 6 characters.
                </small>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="form-group">

                <label htmlFor="register-confirm-password">
                  Confirm password
                </label>

                <input
                  id="register-confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  minLength="6"
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
                    <strong>Registration failed</strong>

                    <p>{error}</p>
                  </div>

                </div>
              )}


              {/* SUCCESS */}

              {success && (
                <div className="auth-success">

                  <span className="auth-success-icon">
                    ✓
                  </span>

                  <div>
                    <strong>Account created</strong>

                    <p>{success}</p>
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
                    Creating account...
                  </>
                ) : (
                  "Create Account →"
                )}

              </button>

            </form>


            {/* LOGIN */}

            <div className="auth-divider">
              <span>Already have an account?</span>
            </div>

            <Link
              to="/login"
              className="auth-create-account"
            >
              Sign in to SupportDesk
              <span>→</span>
            </Link>


            <p className="auth-security-note">
              Your password is securely processed before
              your account is created.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;
