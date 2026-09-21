import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import AgentDashboard from "./pages/AgentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/create-ticket" element={<CreateTicket />} />

        <Route
  path="/tickets/:id"
  element={<TicketDetails />}
/>

<Route
  path="/agent-dashboard"
  element={<AgentDashboard />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;