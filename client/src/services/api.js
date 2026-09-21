const API_BASE_URL = "http://localhost:5000/api";

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const loginUser = async (email, password) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });
};

export const registerUser = async (name, email, password) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password
    })
  });
};

export const getProfile = async (token) => {
  return apiRequest("/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getCustomerTickets = async (token) => {
  return apiRequest("/tickets", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const createTicket = async (token, ticketData) => {
  return apiRequest("/tickets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(ticketData)
  });
};

export const getTicketById = async (token, ticketId) => {
  return apiRequest(`/tickets/${ticketId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getTicketComments = async (token, ticketId) => {
  return apiRequest(`/tickets/${ticketId}/comments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addTicketComment = async (token, ticketId, comment) => {
  return apiRequest(`/tickets/${ticketId}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      comment
    })
  });
};

export const updateTicket = async (token, ticketId, ticketData) => {
  return apiRequest(`/tickets/${ticketId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(ticketData)
  });
};

export const getAssignedTickets = async (token) => {
  return apiRequest("/tickets/assigned", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const assignTicket = async (token, ticketId) => {
  return apiRequest(`/tickets/${ticketId}/assign`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
export const getCustomerStats = async (token) => {
  return apiRequest("/tickets/stats", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
export const getAgentStats = async (token) => {
  return apiRequest("/tickets/agent-stats", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
};