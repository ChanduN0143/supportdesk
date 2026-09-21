import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createTicket } from "../services/api";
import "./CreateTicket.css";

function CreateTicket() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createTicket(token, {
        title: title.trim(),
        description: description.trim(),
        priority
      });

      setSuccess("Ticket created successfully!");

      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-page">

      {/* HEADER */}

      <header className="create-ticket-header">

        <div className="create-ticket-brand">

          <div className="create-ticket-brand-icon">
            S
          </div>

          <div>
            <h1>SupportDesk</h1>
            <p>Customer Portal</p>
          </div>

        </div>

        <div className="create-ticket-header-right">

          <span className="create-ticket-user">
            {user?.name}
          </span>

          <button
            className="create-ticket-dashboard"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="create-ticket-container">

        <button
          className="create-ticket-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="create-ticket-layout">

          {/* FORM */}

          <section className="create-ticket-card">

            <div className="create-ticket-heading">

              <p>SUPPORT REQUEST</p>

              <h2>Create a New Ticket</h2>

              <span>
                Tell us about your issue and our support
                team will help you resolve it.
              </span>

            </div>

            {error && (
              <div className="create-ticket-alert error">
                <strong>Unable to create ticket</strong>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="create-ticket-alert success">
                <strong>Ticket created successfully!</strong>

                <span>
                  Your support request has been submitted.
                </span>

                <button
                  onClick={() => navigate("/dashboard")}
                >
                  View My Tickets →
                </button>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="create-ticket-form"
            >

              {/* TITLE */}

              <div className="form-group">

                <label htmlFor="ticket-title">
                  Ticket Title
                  <span>*</span>
                </label>

                <input
                  id="ticket-title"
                  type="text"
                  placeholder="Example: Unable to reset my password"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  maxLength="200"
                  required
                  disabled={loading}
                />

                <small>
                  Briefly describe the issue you're facing.
                </small>

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label htmlFor="ticket-description">
                  Description
                  <span>*</span>
                </label>

                <textarea
                  id="ticket-description"
                  placeholder="Please provide as much detail as possible about your issue..."
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows="7"
                  required
                  disabled={loading}
                />

                <small>
                  Include relevant details such as what happened,
                  when it happened, and any error messages.
                </small>

              </div>

              {/* PRIORITY */}

              <div className="form-group">

                <label htmlFor="ticket-priority">
                  Priority
                  <span>*</span>
                </label>

                <select
                  id="ticket-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                  disabled={loading}
                >
                  <option value="low">
                    Low — General question or minor issue
                  </option>

                  <option value="medium">
                    Medium — Issue affecting normal usage
                  </option>

                  <option value="high">
                    High — Important functionality affected
                  </option>

                  <option value="urgent">
                    Urgent — Critical issue requiring immediate attention
                  </option>
                </select>

              </div>

              {/* ACTIONS */}

              <div className="create-ticket-actions">

                <button
                  type="button"
                  className="cancel-ticket-button"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-ticket-button"
                  disabled={loading}
                >
                  {loading
                    ? "Creating Ticket..."
                    : "Submit Ticket →"}
                </button>

              </div>

            </form>

          </section>

          {/* SIDEBAR */}

          <aside className="create-ticket-sidebar">

            <div className="create-ticket-info-card">

              <div className="info-icon">
                ✓
              </div>

              <h3>What happens next?</h3>

              <div className="info-step">

                <span>1</span>

                <div>
                  <strong>Ticket Submitted</strong>
                  <p>
                    Your request is securely recorded
                    in our support system.
                  </p>
                </div>

              </div>

              <div className="info-step">

                <span>2</span>

                <div>
                  <strong>Support Review</strong>
                  <p>
                    A support agent reviews and
                    manages your request.
                  </p>
                </div>

              </div>

              <div className="info-step">

                <span>3</span>

                <div>
                  <strong>Resolution</strong>
                  <p>
                    Track updates and communicate
                    with the support team.
                  </p>
                </div>

              </div>

            </div>

            <div className="create-ticket-sla-card">

              <p>SLA GUIDELINES</p>

              <h3>Priority affects response time</h3>

              <div className="sla-guide-row">
                <span className="guide-dot urgent"></span>
                <span>Urgent</span>
                <strong>4 hours</strong>
              </div>

              <div className="sla-guide-row">
                <span className="guide-dot high"></span>
                <span>High</span>
                <strong>8 hours</strong>
              </div>

              <div className="sla-guide-row">
                <span className="guide-dot medium"></span>
                <span>Medium</span>
                <strong>24 hours</strong>
              </div>

              <div className="sla-guide-row">
                <span className="guide-dot low"></span>
                <span>Low</span>
                <strong>48 hours</strong>
              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default CreateTicket;