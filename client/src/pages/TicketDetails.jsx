import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getTicketById,
  getTicketComments,
  addTicketComment,
  updateTicket,
  assignTicket
} from "../services/api";
import "./TicketDetails.css";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);

  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [ticketData, commentsData] =
          await Promise.all([
            getTicketById(token, id),
            getTicketComments(token, id)
          ]);

        setTicket(ticketData.ticket);
        setComments(commentsData.comments);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTicketDetails();
    }
  }, [token, id]);

  const handleStatusUpdate = async () => {
    try {
      setError("");

      const data = await updateTicket(
        token,
        id,
        {
          status
        }
      );

      setTicket(data.ticket);
      setStatus("");
      setSuccess("Ticket status updated successfully!");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAssignToMe = async () => {
    try {
      setError("");

      const data = await assignTicket(token, id);

      setTicket(data.ticket);
      setSuccess("Ticket assigned to you successfully!");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    setCommentError("");
    setSuccess("");

    if (!comment.trim()) {
      setCommentError("Please enter a comment.");
      return;
    }

    setCommentLoading(true);

    try {
      const data = await addTicketComment(
        token,
        id,
        comment.trim()
      );

      setComments((previousComments) => [
        ...previousComments,
        data.comment
      ]);

      setComment("");

      setSuccess("Comment added successfully!");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setCommentError(error.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const formatStatus = (value) => {
    if (!value) return "";

    return value
      .replace("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const formatSlaStatus = (value) => {
    const labels = {
      breached: "SLA Breached",
      on_track: "On Track",
      resolved_within_sla:
        "Resolved Within SLA",
      resolved_after_sla:
        "Resolved After SLA",
      sla_not_available: "SLA Not Available"
    };

    return labels[value] || value;
  };

  const getSlaClass = (value) => {
    if (value === "breached") {
      return "sla-status breached";
    }

    if (value === "on_track") {
      return "sla-status on-track";
    }

    if (value === "resolved_within_sla") {
      return "sla-status within";
    }

    if (value === "resolved_after_sla") {
      return "sla-status after";
    }

    return "sla-status unavailable";
  };

  if (loading) {
    return (
      <div className="ticket-page">
        <div className="ticket-loading">
          <div className="ticket-spinner"></div>
          <h3>Loading ticket...</h3>
          <p>Please wait while we fetch the ticket details.</p>
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="ticket-page">
        <div className="ticket-error-page">
          <div className="ticket-error-icon">!</div>
          <h2>Unable to load ticket</h2>
          <p>{error}</p>

          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-page">
        <div className="ticket-error-page">
          <div className="ticket-error-icon">?</div>
          <h2>Ticket not found</h2>
          <p>
            The ticket you're looking for doesn't exist
            or is no longer available.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-page">

      {/* HEADER */}

      <header className="ticket-header">
        <div className="ticket-brand">
          <div className="ticket-brand-icon">S</div>

          <div>
            <h1>SupportDesk</h1>
            <p>
              {user?.role === "agent"
                ? "Agent Workspace"
                : "Customer Portal"}
            </p>
          </div>
        </div>

        <div className="ticket-header-actions">
          <span className="ticket-user-name">
            {user?.name}
          </span>

          <button
            className="ticket-dashboard-button"
            onClick={() =>
              navigate(
                user?.role === "agent"
                  ? "/agent-dashboard"
                  : "/dashboard"
              )
            }
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}

      <main className="ticket-container">

        {/* BACK */}

        <button
          className="ticket-back-link"
          onClick={() => navigate(-1)}
        >
          ← Back to Dashboard
        </button>

        {/* TOP SECTION */}

        <section className="ticket-title-section">

          <div className="ticket-title-left">

            <div className="ticket-number">
              Ticket #{ticket.id}
            </div>

            <h2>{ticket.title}</h2>

            <p className="ticket-created">
              Created{" "}
              {new Date(
                ticket.created_at
              ).toLocaleString()}
            </p>

          </div>

          <div className="ticket-title-badges">

            <span
              className={`ticket-status status-${ticket.status}`}
            >
              {formatStatus(ticket.status)}
            </span>

            <span
              className={`ticket-priority priority-${ticket.priority}`}
            >
              {ticket.priority}
            </span>

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="ticket-alert error">
            <strong>Action failed</strong>
            <span>{error}</span>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="ticket-alert success">
            <strong>Success</strong>
            <span>{success}</span>
          </div>
        )}

        <div className="ticket-layout">

          {/* LEFT COLUMN */}

          <div className="ticket-main-column">

            {/* DESCRIPTION */}

            <section className="ticket-card">

              <div className="ticket-card-header">
                <div>
                  <p className="ticket-card-label">
                    REQUEST DETAILS
                  </p>

                  <h3>Issue Description</h3>
                </div>
              </div>

              <div className="ticket-description">
                {ticket.description}
              </div>

            </section>

            {/* SLA */}

            <section className="ticket-card">

              <div className="ticket-card-header">
                <div>
                  <p className="ticket-card-label">
                    SERVICE LEVEL AGREEMENT
                  </p>

                  <h3>SLA Information</h3>
                </div>

                <span
                  className={getSlaClass(
                    ticket.sla_status
                  )}
                >
                  {formatSlaStatus(
                    ticket.sla_status
                  )}
                </span>
              </div>

              <div className="sla-grid">

                <div className="sla-item">
                  <span>SLA Due</span>

                  <strong>
                    {ticket.sla_due_at
                      ? new Date(
                          ticket.sla_due_at
                        ).toLocaleString()
                      : "Not available"}
                  </strong>
                </div>

                <div className="sla-item">
                  <span>First Response</span>

                  <strong>
                    {ticket.first_response_at
                      ? new Date(
                          ticket.first_response_at
                        ).toLocaleString()
                      : "Not responded yet"}
                  </strong>
                </div>

                <div className="sla-item">
                  <span>Resolved At</span>

                  <strong>
                    {ticket.resolved_at
                      ? new Date(
                          ticket.resolved_at
                        ).toLocaleString()
                      : "Not resolved yet"}
                  </strong>
                </div>

              </div>

            </section>

            {/* CONVERSATION */}

            <section className="ticket-card">

              <div className="ticket-card-header">
                <div>
                  <p className="ticket-card-label">
                    COMMUNICATION
                  </p>

                  <h3>Conversation</h3>
                </div>

                <span className="comment-count">
                  {comments.length}{" "}
                  {comments.length === 1
                    ? "message"
                    : "messages"}
                </span>
              </div>

              {comments.length === 0 ? (
                <div className="no-comments">
                  <div className="no-comments-icon">
                    💬
                  </div>

                  <h4>No comments yet</h4>

                  <p>
                    Start the conversation by adding
                    a message below.
                  </p>
                </div>
              ) : (
                <div className="comments-list">

                  {comments.map((item) => (
                    <div
                      key={item.id}
                      className="comment-item"
                    >

                      <div className="comment-avatar">
                        {item.author_name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="comment-content">

                        <div className="comment-top">

                          <div>
                            <strong>
                              {item.author_name}
                            </strong>

                            <span
                              className={`comment-role ${item.author_role}`}
                            >
                              {item.author_role}
                            </span>
                          </div>

                          <small>
                            {new Date(
                              item.created_at
                            ).toLocaleString()}
                          </small>

                        </div>

                        <p>{item.comment}</p>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </section>

            {/* ADD COMMENT */}

            <section className="ticket-card comment-form-card">

              <div className="ticket-card-header">

                <div>
                  <p className="ticket-card-label">
                    MESSAGE
                  </p>

                  <h3>Add a Comment</h3>
                </div>

              </div>

              <form
                onSubmit={handleCommentSubmit}
                className="comment-form"
              >

                <textarea
                  placeholder="Write your message here..."
                  value={comment}
                  onChange={(event) =>
                    setComment(event.target.value)
                  }
                  rows="5"
                  disabled={commentLoading}
                />

                {commentError && (
                  <div className="comment-error">
                    {commentError}
                  </div>
                )}

                <div className="comment-form-footer">

                  <span>
                    Keep your message clear and
                    professional.
                  </span>

                  <button
                    type="submit"
                    className="comment-submit"
                    disabled={commentLoading}
                  >
                    {commentLoading
                      ? "Adding..."
                      : "Add Comment →"}
                  </button>

                </div>

              </form>

            </section>

          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="ticket-sidebar">

            {/* TICKET SUMMARY */}

            <section className="ticket-card summary-card">

              <div className="ticket-card-header">
                <div>
                  <p className="ticket-card-label">
                    TICKET SUMMARY
                  </p>

                  <h3>Overview</h3>
                </div>
              </div>

              <div className="summary-list">

                <div className="summary-row">
                  <span>Ticket ID</span>
                  <strong>#{ticket.id}</strong>
                </div>

                <div className="summary-row">
                  <span>Status</span>

                  <strong
                    className={`summary-status status-${ticket.status}`}
                  >
                    {formatStatus(ticket.status)}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Priority</span>

                  <strong
                    className={`summary-priority priority-${ticket.priority}`}
                  >
                    {ticket.priority}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Created</span>

                  <strong>
                    {new Date(
                      ticket.created_at
                    ).toLocaleDateString()}
                  </strong>
                </div>

              </div>

            </section>

            {/* AGENT ACTIONS */}

            {user?.role === "agent" && (
              <section className="ticket-card agent-actions-card">

                <div className="ticket-card-header">

                  <div>
                    <p className="ticket-card-label">
                      AGENT CONTROLS
                    </p>

                    <h3>Manage Ticket</h3>
                  </div>

                </div>

                {ticket.assigned_to !== user.id && (
                  <button
                    className="assign-button"
                    onClick={handleAssignToMe}
                  >
                    Assign Ticket to Me
                  </button>
                )}

                {ticket.assigned_to === user.id && (
                  <div className="assigned-message">
                    ✓ This ticket is assigned to you
                  </div>
                )}

                <div className="status-control">

                  <label>
                    Update Status
                  </label>

                  <select
                    value={
                      status || ticket.status
                    }
                    onChange={(event) =>
                      setStatus(
                        event.target.value
                      )
                    }
                  >
                    <option value="open">
                      Open
                    </option>

                    <option value="in_progress">
                      In Progress
                    </option>

                    <option value="resolved">
                      Resolved
                    </option>
                  </select>

                  <button
                    className="update-status-button"
                    onClick={handleStatusUpdate}
                    disabled={
                      !status ||
                      status === ticket.status
                    }
                  >
                    Update Status
                  </button>

                </div>

              </section>
            )}

            {/* SLA QUICK VIEW */}

            <section className="ticket-card quick-sla-card">

              <div className="ticket-card-header">

                <div>
                  <p className="ticket-card-label">
                    SLA
                  </p>

                  <h3>Quick Status</h3>
                </div>

              </div>

              <div
                className={getSlaClass(
                  ticket.sla_status
                )}
              >
                {formatSlaStatus(
                  ticket.sla_status
                )}
              </div>

              <p className="sla-help-text">
                {ticket.sla_status === "breached"
                  ? "This ticket has exceeded its SLA deadline."
                  : ticket.sla_status ===
                    "on_track"
                  ? "This ticket is currently within its SLA target."
                  : ticket.sla_status ===
                    "resolved_within_sla"
                  ? "The ticket was resolved within the SLA target."
                  : ticket.sla_status ===
                    "resolved_after_sla"
                  ? "The ticket was resolved after the SLA deadline."
                  : "SLA information is not available for this ticket."}
              </p>

            </section>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default TicketDetails;