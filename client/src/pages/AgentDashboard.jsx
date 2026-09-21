import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAssignedTickets,
  getAgentStats
} from "../services/api";
import "./AgentDashboard.css";

function AgentDashboard() {
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

        const [ticketsData, statsData] = await Promise.all([
          getAssignedTickets(token),
          getAgentStats(token)
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

    const result = tickets
      .filter((ticket) => {
        if (!search) {
          return true;
        }

        return (
          ticket.title.toLowerCase().includes(search) ||
          ticket.description.toLowerCase().includes(search) ||
          ticket.customer_name.toLowerCase().includes(search) ||
          ticket.customer_email.toLowerCase().includes(search)
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
          return new Date(b.created_at) - new Date(a.created_at);
        }

        if (sortOption === "oldest") {
          return new Date(a.created_at) - new Date(b.created_at);
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

    return result;
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
      resolved_within_sla: "Resolved Within SLA",
      resolved_after_sla: "Resolved After SLA",
      sla_not_available: "SLA N/A"
    };

    return labels[status] || status;
  };

  return (
    <div className="agent-dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="brand-icon">S</div>

          <div>
            <h1>SupportDesk</h1>
            <p>Agent Workspace</p>
          </div>
        </div>

        <div className="header-user">
          <div className="user-info">
            <span className="user-name">
              {user?.name}
            </span>

            <span className="user-role">
              Support Agent
            </span>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="dashboard-container">
        {/* WELCOME */}
        <section className="welcome-section">
          <div>
            <p className="welcome-label">
              AGENT DASHBOARD
            </p>

            <h2>
              Welcome back, {user?.name} 👋
            </h2>

            <p>
              Manage your assigned customer tickets
              and keep SLAs on track.
            </p>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="error-banner">
            <strong>Something went wrong</strong>
            <span>{error}</span>
          </div>
        )}

        {/* STATISTICS */}
        <section className="stats-section">
          <div className="section-heading">
            <div>
              <p className="section-label">
                OVERVIEW
              </p>

              <h2>Dashboard Statistics</h2>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total-icon">
                #
              </div>

              <div>
                <p>Total Assigned</p>
                <h3>{stats.total}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon open-icon">
                ●
              </div>

              <div>
                <p>Open</p>
                <h3>{stats.open}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon progress-icon">
                ↻
              </div>

              <div>
                <p>In Progress</p>
                <h3>{stats.in_progress}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon resolved-icon">
                ✓
              </div>

              <div>
                <p>Resolved</p>
                <h3>{stats.resolved}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon breach-icon">
                !
              </div>

              <div>
                <p>SLA Breached</p>
                <h3>{stats.breached}</h3>
              </div>
            </div>
          </div>
        </section>

        {/* TICKETS */}
        <section className="tickets-section">
          <div className="tickets-heading">
            <div>
              <p className="section-label">
                WORK QUEUE
              </p>

              <h2>Assigned Tickets</h2>

              <p className="ticket-count">
                Showing {filteredTickets.length} of{" "}
                {tickets.length} tickets
              </p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="ticket-controls">
            <div className="search-wrapper">
              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search tickets, customers or email..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            <div className="filter-group">
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
            </div>

            <div className="filter-group">
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

                <option value="high">
                  High
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="low">
                  Low
                </option>
              </select>
            </div>

            <div className="filter-group">
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
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your tickets...</p>
            </div>
          )}

          {/* EMPTY ASSIGNED TICKETS */}
          {!loading &&
            !error &&
            tickets.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  ✓
                </div>

                <h3>No tickets assigned</h3>

                <p>
                  You currently have no tickets in
                  your work queue.
                </p>
              </div>
            )}

          {/* NO SEARCH RESULTS */}
          {!loading &&
            !error &&
            tickets.length > 0 &&
            filteredTickets.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  🔍
                </div>

                <h3>No matching tickets</h3>

                <p>
                  Try changing your search or filter
                  options.
                </p>
              </div>
            )}

          {/* TICKET CARDS */}
          {!loading &&
            !error &&
            filteredTickets.length > 0 && (
              <div className="ticket-grid">
                {filteredTickets.map((ticket) => (
                  <article
                    className="ticket-card"
                    key={ticket.id}
                    onClick={() =>
                      navigate(
                        `/tickets/${ticket.id}`
                      )
                    }
                  >
                    <div className="ticket-card-top">
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

                    <p className="ticket-description">
                      {ticket.description}
                    </p>

                    <div className="customer-info">
                      <div className="customer-avatar">
                        {ticket.customer_name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {ticket.customer_name}
                        </strong>

                        <span>
                          {ticket.customer_email}
                        </span>
                      </div>
                    </div>

                    <div className="ticket-meta">
                      <div>
                        <span className="meta-label">
                          Status
                        </span>

                        <span
                          className={getStatusClass(
                            ticket.status
                          )}
                        >
                          {formatStatus(
                            ticket.status
                          )}
                        </span>
                      </div>

                      <div>
                        <span className="meta-label">
                          SLA
                        </span>

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
                    </div>

                    <div className="ticket-footer">
                      <span>
                        View Ticket
                      </span>

                      <span className="arrow">
                        →
                      </span>
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

export default AgentDashboard;