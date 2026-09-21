const express = require("express");
const pool = require("./db");
const authenticateToken = require("./authMiddleware");

const router = express.Router();
const getSlaStatus = (ticket) => {
  // Ticket was created before SLA tracking was added
  if (!ticket.sla_due_at) {
    return "sla_not_available";
  }

  if (ticket.resolved_at) {
    if (new Date(ticket.resolved_at) <= new Date(ticket.sla_due_at)) {
      return "resolved_within_sla";
    }

    return "resolved_after_sla";
  }

  if (new Date() > new Date(ticket.sla_due_at)) {
    return "breached";
  }

  return "on_track";
};


router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, title, description, priority, status,
              created_at, updated_at,
              sla_due_at, first_response_at, resolved_at
       FROM tickets
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    const ticketsWithSla = result.rows.map((ticket) => ({
      ...ticket,
      sla_status: getSlaStatus(ticket)
    }));

    res.status(200).json({
      message: "Tickets fetched successfully",
      tickets: ticketsWithSla
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});






// ======================================================
// 6. GET TICKETS ASSIGNED TO LOGGED-IN AGENT
// GET /api/tickets/assigned
// ======================================================

router.get("/assigned", authenticateToken, async (req, res) => {
  try {
    // Only agents can access this route
    if (req.user.role !== "agent") {
      return res.status(403).json({
        message: "Only agents can access assigned tickets"
      });
    }

    const result = await pool.query(
      `SELECT
    t.id,
    t.title,
    t.description,
    t.priority,
    t.status,
    t.user_id,
    u.name AS customer_name,
    u.email AS customer_email,
    t.assigned_to,
    t.created_at,
    t.updated_at,
    t.sla_due_at,
    t.first_response_at,
    t.resolved_at
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       WHERE t.assigned_to = $1
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );

   const ticketsWithSla = result.rows.map((ticket) => ({
  ...ticket,
  sla_status: getSlaStatus(ticket)
}));

res.status(200).json({
  message: "Assigned tickets fetched successfully",
  tickets: ticketsWithSla
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// GET CUSTOMER DASHBOARD STATISTICS
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Only customers can access dashboard statistics"
      });
    }

    const result = await pool.query(
      `SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'open') AS open,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'resolved') AS resolved
       FROM tickets
       WHERE user_id = $1`,
      [req.user.id]
    );

    const breachedResult = await pool.query(
      `SELECT COUNT(*) AS breached
       FROM tickets
       WHERE user_id = $1
         AND sla_due_at IS NOT NULL
         AND resolved_at IS NULL
         AND CURRENT_TIMESTAMP > sla_due_at`,
      [req.user.id]
    );

    res.status(200).json({
      message: "Dashboard statistics fetched successfully",
      stats: {
        total: Number(result.rows[0].total),
        open: Number(result.rows[0].open),
        in_progress: Number(result.rows[0].in_progress),
        resolved: Number(result.rows[0].resolved),
        breached: Number(breachedResult.rows[0].breached)
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});
// ======================================================
// AGENT DASHBOARD STATISTICS
// GET /api/tickets/agent-stats
// ======================================================

router.get("/agent-stats", authenticateToken, async (req, res) => {
  try {
    // Only agents can access this route
    if (req.user.role !== "agent") {
      return res.status(403).json({
        message: "Only agents can access agent statistics"
      });
    }

    const result = await pool.query(
      `SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'open') AS open,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'resolved') AS resolved
       FROM tickets
       WHERE assigned_to = $1`,
      [req.user.id]
    );

    const breachedResult = await pool.query(
      `SELECT COUNT(*) AS breached
       FROM tickets
       WHERE assigned_to = $1
         AND sla_due_at IS NOT NULL
         AND resolved_at IS NULL
         AND CURRENT_TIMESTAMP > sla_due_at`,
      [req.user.id]
    );

    res.status(200).json({
      message: "Agent dashboard statistics fetched successfully",
      stats: {
        total: Number(result.rows[0].total),
        open: Number(result.rows[0].open),
        in_progress: Number(result.rows[0].in_progress),
        resolved: Number(result.rows[0].resolved),
        breached: Number(breachedResult.rows[0].breached)
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ======================================================
// 3. GET A SINGLE TICKET BY ID
// GET /api/tickets/:id
// ======================================================

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
          t.id,
          t.user_id,
          t.title,
          t.description,
          t.priority,
          t.status,
          t.assigned_to,
          t.created_at,
          t.updated_at,
          t.sla_due_at,
          t.first_response_at,
          t.resolved_at,
          u.name AS customer_name,
          u.email AS customer_email
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

   const ticket = result.rows[0];

if (req.user.role === "agent") {
  // Agents can view comments before assigning a ticket.
}

if (req.user.role === "agent") {
  // Agents can view tickets so they can decide whether to assign them.
}

const slaStatus = getSlaStatus(ticket);

    res.status(200).json({
      message: "Ticket fetched successfully",
      ticket: {
        ...ticket,
        sla_status: slaStatus
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// ======================================================
// 4. ADD COMMENT TO A TICKET
// POST /api/tickets/:id/comments
// ======================================================

router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    // Check required field
    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment is required"
      });
    }

    // Find the ticket
    const ticketResult = await pool.query(
      `SELECT *
       FROM tickets
       WHERE id = $1`,
      [id]
    );

    // Ticket does not exist
    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    const ticket = ticketResult.rows[0];

    // ==================================================
    // CUSTOMER PERMISSION
    // Customer can comment only on their own ticket
    // ==================================================

    if (req.user.role === "customer") {
      if (ticket.user_id !== req.user.id) {
        return res.status(403).json({
          message: "You can only comment on your own tickets"
        });
      }
    }

    // ==================================================
    // AGENT PERMISSION
    // Agent can comment only on tickets assigned to them
    // ==================================================

    if (req.user.role === "agent") {
      if (ticket.assigned_to !== req.user.id) {
        return res.status(403).json({
          message: "You can only comment on tickets assigned to you"
        });
      }
    }

    // ==================================================
    // CREATE COMMENT
    // ==================================================

const result = await pool.query(
  `INSERT INTO ticket_comments (ticket_id, user_id, comment)
   VALUES ($1, $2, $3)
   RETURNING id, ticket_id, user_id, comment, created_at, updated_at`,
  [id, req.user.id, comment.trim()]
);

const commentWithAuthor = await pool.query(
  `SELECT
      c.id,
      c.ticket_id,
      c.user_id,
      u.name AS author_name,
      u.role AS author_role,
      c.comment,
      c.created_at,
      c.updated_at
   FROM ticket_comments c
   JOIN users u ON c.user_id = u.id
   WHERE c.id = $1`,
  [result.rows[0].id]
);

// Record the first response time when an agent comments
if (req.user.role === "agent" && !ticket.first_response_at) {
  await pool.query(
    `UPDATE tickets
     SET first_response_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [id]
  );
}
  res.status(201).json({
  message: "Comment added successfully",
  comment: commentWithAuthor.rows[0]
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// ======================================================
// 5. GET COMMENTS FOR A TICKET
// GET /api/tickets/:id/comments
// ======================================================

router.get("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the ticket
    const ticketResult = await pool.query(
      `SELECT *
       FROM tickets
       WHERE id = $1`,
      [id]
    );

    // Ticket does not exist
    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    const ticket = ticketResult.rows[0];

    // ==================================================
    // CUSTOMER PERMISSION
    // ==================================================

    if (req.user.role === "customer") {
      if (ticket.user_id !== req.user.id) {
        return res.status(403).json({
          message: "You can only view comments on your own tickets"
        });
      }
    }

    // ==================================================
    // AGENT PERMISSION
    // ==================================================


    // ==================================================
    // GET COMMENTS
    // ==================================================

    const result = await pool.query(
      `SELECT
          c.id,
          c.ticket_id,
          c.user_id,
          u.name AS author_name,
          u.role AS author_role,
          c.comment,
          c.created_at,
          c.updated_at
       FROM ticket_comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.ticket_id = $1
       ORDER BY c.created_at ASC`,
      [id]
    );

    res.status(200).json({
      message: "Comments fetched successfully",
      comments: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ======================================================
// 4. UPDATE TICKET STATUS AND PRIORITY
// PATCH /api/tickets/:id
// ======================================================

router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    // Find the ticket
    const ticketResult = await pool.query(
      `SELECT *
       FROM tickets
       WHERE id = $1`,
      [id]
    );

    // Ticket does not exist
    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    const ticket = ticketResult.rows[0];

    // ==================================================
    // CUSTOMER PERMISSION
    // Customer can update only their own ticket
    // ==================================================

    if (req.user.role === "customer") {
      if (ticket.user_id !== req.user.id) {
        return res.status(403).json({
          message: "You can only update your own tickets"
        });
      }
    }

    // ==================================================
    // AGENT PERMISSION
    // Agent can update only tickets assigned to them
    // ==================================================

    if (req.user.role === "agent") {
      if (ticket.assigned_to !== req.user.id) {
        return res.status(403).json({
          message: "You can only update tickets assigned to you"
        });
      }
    }

    // ==================================================
    // UPDATE TICKET
    // ==================================================

    const result = await pool.query(
  `UPDATE tickets
   SET status = COALESCE($1, status),
       priority = COALESCE($2, priority),
       resolved_at = CASE
         WHEN $1 = 'resolved' AND resolved_at IS NULL
           THEN CURRENT_TIMESTAMP
         ELSE resolved_at
       END,
       updated_at = CURRENT_TIMESTAMP
   WHERE id = $3
   RETURNING *`,
  [status, priority, id]
);

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ======================================================
// 5. ASSIGN TICKET TO LOGGED-IN AGENT
// PATCH /api/tickets/:id/assign
// ======================================================

router.patch("/:id/assign", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if logged-in user is an agent
    if (req.user.role !== "agent") {
      return res.status(403).json({
        message: "Only agents can assign tickets"
      });
    }

    // Check if ticket exists
    const ticketResult = await pool.query(
      `SELECT id, user_id, title, description, priority, status,
              assigned_to, created_at, updated_at
       FROM tickets
       WHERE id = $1`,
      [id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    // Assign ticket to logged-in agent
    const result = await pool.query(
      `UPDATE tickets
       SET assigned_to = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, user_id, title, description, priority,
                 status, assigned_to, created_at, updated_at`,
      [req.user.id, id]
    );

    res.status(200).json({
      message: "Ticket assigned successfully",
      ticket: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// CREATE A NEW TICKET
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required"
      });
    }

    const ticketPriority = priority || "medium";

    const slaHours = {
      urgent: 4,
      high: 8,
      medium: 24,
      low: 48
    };

    const hours = slaHours[ticketPriority] || 24;

    const result = await pool.query(
      `INSERT INTO tickets (
        user_id,
        title,
        description,
        priority,
        sla_due_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        CURRENT_TIMESTAMP + ($5 * INTERVAL '1 hour')
      )
      RETURNING *`,
      [
        req.user.id,
        title,
        description,
        ticketPriority,
        hours
      ]
    );

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;