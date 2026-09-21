import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getCustomerTickets,
  getCustomerStats
} from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    breached: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [ticketsData, statsData] =
          await Promise.all([
            getCustomerTickets(token),
            getCustomerStats(token)
          ]);

        setTickets(ticketsData.tickets);
        setStats(statsData.stats);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const filteredTickets = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return tickets
      .filter((ticket) => {
        if (!search) {
          return true;
        }

        return (
          ticket.title.toLowerCase().includes(search) ||
          ticket.description.toLowerCase().includes(search)
        );
      })
      .filter((ticket) => {
        if (statusFilter === "all") {
          return true;
        }

        return ticket.status === statusFilter;
      })
      .filter((ticket) => {
        if (priorityFilter === "all") {
          return true;
        }

        return ticket.priority === priorityFilter;
      })
      .sort((a, b) => {
        if (sortOption === "newest") {
          return (
            new Date(b.created_at) -
            new Date(a.created_at)
          );
        }

        if (sortOption === "oldest") {
          return (
            new Date(a.created_at) -
            new Date(b.created_at)
          );
        }

        if (sortOption === "priority") {
          const priorityOrder = {
            urgent: 1,
            high: 2,
            medium: 3,
            low: 4
          };

          return (
            priorityOrder[a.priority] -
            priorityOrder[b.priority]
          );
        }

        if (sortOption === "sla") {
          const slaOrder = {
            breached: 1,
            on_track: 2,
            resolved_after_sla: 3,
            resolved_within_sla: 4,
            sla_not_available: 5
          };

          return (
            slaOrder[a.sla_status] -
            slaOrder[b.sla_status]
          );
        }

        return 0;
      });
  }, [
    tickets,
    searchTerm,
    statusFilter,
    priorityFilter,
    sortOption
  ]);

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  const getPriorityClass = (priority) => {
    return `priority-badge priority-${priority}`;
  };

  const getSlaClass = (slaStatus) => {
    if (slaStatus === "breached") {
      return "sla-badge sla-breached";
    }

    if (slaStatus === "on_track") {
      return "sla-badge sla-on-track";
    }

    if (slaStatus === "resolved_within_sla") {
      return "sla-badge sla-within";
    }

    if (slaStatus === "resolved_after_sla") {
      return "sla-badge sla-after";
    }

    return "sla-badge sla-unavailable";
  };

  const formatStatus = (status) => {
    return status
      .replace("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const formatSlaStatus = (status) => {
    const labels = {
      breached: "SLA Breached",
      on_track: "On Track",
      resolved_within_sla:
        "Resolved Within SLA",
      resolved_after_sla:
        "Resolved After SLA",
      sla_not_available: "SLA N/A"
    };

    return labels[status] || status;
  };

  return (
    <div className="customer-dashboard">
      {/* HEADER */}
      <header className="customer-header">
        <div className="customer-brand">
          <div className="brand-icon">S</div>

          <div>
            <h1>SupportDesk</h1>
            <p>Customer Portal</p>
          </div>
        </div>

        <div className="customer-header-right">
          <div className="customer-user">
            <span>{user?.name}</span>
            <small>Customer</small>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="customer-container">
        {/* WELCOME */}
        <section className="customer-welcome">
          <div>
            <p className="welcome-label">
              CUSTOMER PORTAL
            </p>

            <h2>
              Hello, {user?.name} 👋
            </h2>

            <p>
              Track your support requests and stay
              updated on their progress.
            </p>
          </div>

          <button
            className="create-ticket-button"
            onClick={() =>
              navigate("/create-ticket")
            }
          >
            <span>+</span>
            Create New Ticket
          </button>
        </section>

        {/* ERROR */}
        {error && (
          <div className="customer-error">
            <strong>
              Unable to load dashboard
            </strong>
            <span>{error}</span>
          </div>
        )}

        {/* STATS */}
        <section className="customer-stats-section">
          <div className="section-title">
            <p>OVERVIEW</p>
            <h2>Your Support Activity</h2>
          </div>

          <div className="customer-stats-grid">
            <div className="customer-stat-card">
              <div className="customer-stat-icon total">
                #
              </div>

              <div>
                <span>Total Tickets</span>
                <strong>{stats.total}</strong>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-icon open">
                ●
              </div>

              <div>
                <span>Open</span>
                <strong>{stats.open}</strong>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-icon progress">
                ↻
              </div>

              <div>
                <span>In Progress</span>
                <strong>
                  {stats.in_progress}
                </strong>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-icon resolved">
                ✓
              </div>

              <div>
                <span>Resolved</span>
                <strong>
                  {stats.resolved}
                </strong>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-icon breached">
                !
              </div>

              <div>
                <span>SLA Breached</span>
                <strong>
                  {stats.breached}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* TICKETS */}
        <section className="customer-tickets-section">
          <div className="customer-section-heading">
            <div>
              <p className="section-title-small">
                SUPPORT REQUESTS
              </p>

              <h2>Your Tickets</h2>

              <span>
                Showing {filteredTickets.length} of{" "}
                {tickets.length} tickets
              </span>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="customer-controls">
            <div className="customer-search">
              <span>🔍</span>

              <input
                type="text"
                placeholder="Search your tickets..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            <div className="customer-filter">
              <label>Status</label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="all">
                  All Statuses
                </option>
                <option value="open">Open</option>
                <option value="in_progress">
                  In Progress
                </option>
                <option value="resolved">
                  Resolved
                </option>
              </select>
            </div>

            <div className="customer-filter">
              <label>Priority</label>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
              >
                <option value="all">
                  All Priorities
                </option>
                <option value="urgent">
                  Urgent
                </option>
                <option value="high">High</option>
                <option value="medium">
                  Medium
                </option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="customer-filter">
              <label>Sort</label>

              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value)
                }
              >
                <option value="newest">
                  Newest First
                </option>
                <option value="oldest">
                  Oldest First
                </option>
                <option value="priority">
                  Priority
                </option>
                <option value="sla">
                  SLA Status
                </option>
              </select>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="customer-loading">
              <div className="customer-spinner"></div>
              <p>Loading your tickets...</p>
            </div>
          )}

          {/* NO TICKETS */}
          {!loading &&
            !error &&
            tickets.length === 0 && (
              <div className="customer-empty">
                <div className="customer-empty-icon">
                  +
                </div>

                <h3>No tickets yet</h3>

                <p>
                  Create a support ticket and our
                  team will get back to you.
                </p>

                <button
                  onClick={() =>
                    navigate("/create-ticket")
                  }
                >
                  Create Your First Ticket
                </button>
              </div>
            )}

          {/* NO MATCHES */}
          {!loading &&
            !error &&
            tickets.length > 0 &&
            filteredTickets.length === 0 && (
              <div className="customer-empty">
                <div className="customer-empty-icon">
                  🔍
                </div>

                <h3>No matching tickets</h3>

                <p>
                  Try changing your search or filters.
                </p>
              </div>
            )}

          {/* TICKETS */}
          {!loading &&
            !error &&
            filteredTickets.length > 0 && (
              <div className="customer-ticket-grid">
                {filteredTickets.map((ticket) => (
                  <article
                    key={ticket.id}
                    className="customer-ticket-card"
                    onClick={() =>
                      navigate(
                        `/tickets/${ticket.id}`
                      )
                    }
                  >
                    <div className="customer-ticket-top">
                      <span className="ticket-id">
                        #{ticket.id}
                      </span>

                      <span
                        className={getPriorityClass(
                          ticket.priority
                        )}
                      >
                        {ticket.priority}
                      </span>
                    </div>

                    <h3>{ticket.title}</h3>

                    <p className="customer-ticket-description">
                      {ticket.description}
                    </p>

                    <div className="customer-ticket-meta">
                      <div>
                        <span>Status</span>

                        <strong
                          className={getStatusClass(
                            ticket.status
                          )}
                        >
                          {formatStatus(
                            ticket.status
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>SLA</span>

                        <strong
                          className={getSlaClass(
                            ticket.sla_status
                          )}
                        >
                          {formatSlaStatus(
                            ticket.sla_status
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="customer-ticket-footer">
                      <span>
                        View Ticket Details
                      </span>

                      <span>→</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;