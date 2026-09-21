import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          Support<span>Desk</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login" className="nav-login">
            Login
          </Link>

          <Link to="/register" className="nav-register">
            Get Started
          </Link>
        </div>

      </nav>


      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            CUSTOMER SUPPORT PLATFORM
          </p>

          <h1>
            Customer support,
            <span> simplified.</span>
          </h1>

          <p className="hero-description">
            Manage customer tickets, assignments, SLA deadlines,
            conversations, and support operations from one powerful platform.
          </p>

          <div className="hero-buttons">

            <Link to="/register" className="primary-button">
              Get Started
            </Link>

            <Link to="/login" className="secondary-button">
              Sign In
            </Link>

          </div>

        </div>


        {/* Dashboard Preview */}
        <div className="dashboard-preview">

          <div className="preview-header">
            <div>
              <p>Support Dashboard</p>
              <span>Good morning, Agent</span>
            </div>

            <div className="preview-avatar">
              A
            </div>
          </div>


          <div className="preview-stats">

            <div className="preview-card">
              <span>Open Tickets</span>
              <strong>24</strong>
            </div>

            <div className="preview-card">
              <span>In Progress</span>
              <strong>12</strong>
            </div>

            <div className="preview-card">
              <span>SLA Breached</span>
              <strong>3</strong>
            </div>

          </div>


          <div className="preview-ticket">

            <div>
              <small>SUP-00124</small>
              <h3>Unable to access my account</h3>
            </div>

            <span className="ticket-status">
              In Progress
            </span>

          </div>


          <div className="preview-ticket">

            <div>
              <small>SUP-00125</small>
              <h3>Payment failed during checkout</h3>
            </div>

            <span className="ticket-high">
              High
            </span>

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="features" id="features">

        <div className="section-heading">

          <p>POWERFUL FEATURES</p>

          <h2>
            Everything your support team needs
          </h2>

        </div>


        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Ticket Management</h3>
            <p>
              Create, assign, track, and manage customer support tickets.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>SLA Tracking</h3>
            <p>
              Monitor response and resolution deadlines with real-time SLA timers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Updates</h3>
            <p>
              Keep customers and agents synchronized with instant ticket updates.
            </p>
          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="footer">
        <div className="logo">
          Support<span>Desk</span>
        </div>

        <p>
          Customer support management made simple.
        </p>
      </footer>

    </div>
  );
}

export default Landing;