# SupportDesk — Customer Support & SLA Management Platform

A full-stack customer support and ticket management platform designed to help customers raise support requests and enable support agents to manage tickets, assignments, priorities, statuses, comments, and Service Level Agreements (SLAs) from a centralized workspace.

**Live Demo:** https://supportdesk-frontend-t9qn.onrender.com/
**Backend API:** https://supportdesk-backend-ik10.onrender.com/
**GitHub:** https://github.com/ChanduN0143/supportdesk


## Overview

SupportDesk is a role-based customer support platform built with **React.js, Node.js, Express.js, and PostgreSQL**.

The application provides separate workflows for **customers and support agents**.

Customers can create and track support tickets, while agents can view assigned tickets, monitor SLA status, update ticket status, and manage their support workload.

The project focuses on building a realistic support workflow with authentication, authorization, relational database design, REST APIs, SLA tracking, search, filtering, sorting, and responsive UI.


## Key Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected application routes
* Role-based access for customers and agents
* Secure password hashing using bcrypt
* Persistent authentication using browser storage

### 🎫 Ticket Management

* Create customer support tickets
* View ticket details
* Track ticket status
* Set ticket priority
* Assign tickets to support agents
* Update ticket information
* Customer-specific ticket visibility
* Agent-specific assigned ticket visibility

### ⏱️ SLA Management

SupportDesk automatically calculates SLA deadlines based on ticket priority.

| Priority | SLA Target |
| -------- | ---------- |
| Urgent   | 4 hours    |
| High     | 8 hours    |
| Medium   | 24 hours   |
| Low      | 48 hours   |

The platform tracks:

* SLA due time
* SLA status
* First response time
* Resolution time
* SLA breaches
* Tickets resolved within SLA
* Tickets resolved after SLA

### 👨‍💼 Agent Dashboard

The agent workspace provides:

* Total assigned tickets
* Open tickets
* In-progress tickets
* Resolved tickets
* SLA-breached tickets
* Assigned ticket work queue
* Customer information
* Ticket priority indicators
* SLA status indicators
* Search functionality
* Status filtering
* Priority filtering
* Sorting by date, priority, and SLA status

### 👤 Customer Dashboard

Customers can:

* View their submitted tickets
* Monitor ticket status
* Track ticket priority
* View SLA information
* Open detailed ticket pages
* Create new support requests

### 💬 Ticket Comments

Agents and customers can communicate through ticket-specific comments.

Each comment records:

* Comment content
* User
* Ticket
* Creation timestamp
* Update timestamp

### 🔎 Search, Filter & Sort

The agent work queue supports:

* Ticket title search
* Ticket description search
* Customer name search
* Customer email search
* Status filtering
* Priority filtering
* Newest-first sorting
* Oldest-first sorting
* Priority-based sorting
* SLA-based sorting

### 📱 Responsive Interface

The frontend is designed to provide a clean experience across:

* Desktop
* Laptop
* Tablet
* Mobile


## Technology Stack

### Frontend

* React.js
* JavaScript (ES6+)
* HTML5
* CSS3
* React Router
* Vite

### Backend

* Node.js
* Express.js
* REST APIs
* JWT
* bcrypt
* CORS
* Helmet
* dotenv

### Database

* PostgreSQL
* SQL
* Relational database design
* Foreign key relationships

### Deployment

* Render
* Production frontend deployment
* Production backend deployment
* Cloud PostgreSQL database

### Development Tools

* Visual Studio Code
* Git
* GitHub
* PowerShell



## System Architecture

                    ┌─────────────────────┐
                    │     Customer        │
                    │                     │
                    │ Register / Login    │
                    │ Create Tickets      │
                    │ Track Tickets       │
                    └──────────┬──────────┘
                               │
                               │
                               ▼
┌──────────────────────────────────────────────────────┐
│                    React Frontend                    │
│                                                      │
│  Authentication │ Customer Dashboard │ Agent Desk    │
│  Ticket Pages   │ Search / Filter    │ SLA Status    │
└──────────────────────────┬───────────────────────────┘
                           │
                           │ REST API + JWT
                           ▼
┌──────────────────────────────────────────────────────┐
│                 Node.js + Express                    │
│                                                      │
│ Authentication │ Ticket APIs │ Assignment │ SLA      │
│ Authorization  │ Comments    │ Statistics │ Security │
└──────────────────────────┬───────────────────────────┘
                           │
                           │ SQL
                           ▼
┌──────────────────────────────────────────────────────┐
│                    PostgreSQL                        │
│                                                      │
│ Users │ Tickets │ Ticket Comments                    │
└──────────────────────────────────────────────────────┘


## Database Design

The application uses PostgreSQL with a relational structure.

### Users

Stores customer and agent accounts.

users
├── id
├── name
├── email
├── password_hash
├── role
├── created_at
└── updated_at


### Tickets

Stores customer support requests.

tickets
├── id
├── user_id
├── title
├── description
├── priority
├── status
├── assigned_to
├── sla_due_at
├── first_response_at
├── resolved_at
├── created_at
└── updated_at


### Ticket Comments

Stores communication associated with each ticket.

ticket_comments
├── id
├── ticket_id
├── user_id
├── comment
├── created_at
└── updated_at


### Relationships

Users
 │
 ├───────────────┐
 │               │
 ▼               ▼
Tickets       Comments
 │               │
 └───────┬───────┘
         │
         ▼
 Ticket Comments


## API Overview

### Authentication

POST /api/auth/register
POST /api/auth/login


### Customer Tickets


GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/:id
PATCH  /api/tickets/:id


### Agent Tickets


GET /api/tickets/assigned
GET /api/tickets/agent-stats
PATCH /api/tickets/:id/assign


### Comments

GET  /api/tickets/:id/comments
POST /api/tickets/:id/comments


### System

GET /
GET /test-db

All protected endpoints use JWT authentication.

## SLA Workflow

When a customer creates a ticket:


Customer creates ticket
        │
        ▼
Priority selected
        │
        ▼
SLA target calculated
        │
        ▼
SLA due time stored
        │
        ▼
Agent assigned
        │
        ▼
Ticket response / updates
        │
        ├───────────────┐
        ▼               ▼
   Resolved         Still Open
        │               │
        ▼               ▼
Check SLA         Check current time
        │               │
        ├───────┐       ├────────────┐
        ▼       ▼       ▼            ▼
    Within    After   On Track    Breached
     SLA       SLA


## Security

The backend includes several security measures:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Role-based authorization
* CORS configuration
* Helmet security middleware
* Environment variables for sensitive configuration
* Database credentials stored outside source code


## Project Structure

supportdesk/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateTicket.jsx
│   │   │   ├── TicketDetails.jsx
│   │   │   └── AgentDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── db.js
│   ├── server.js
│   ├── authRoutes.js
│   ├── ticketRoutes.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md


## Local Development

### 1. Clone the repository

bash
git clone https://github.com/ChanduN0143/supportdesk.git
cd supportdesk


### 2. Install frontend dependencies

bash
cd client
npm install


### 3. Configure frontend environment

Create a `.env` file inside `client`:

 env
VITE_API_BASE_URL=http://localhost:5000/api


### 4. Install backend dependencies
 
 bash
cd ../server
npm install

### 5. Configure backend environment

Create a `.env` file inside `server`:

env
PORT=5000

DB_USER=your_database_user
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

### 6. Start the backend

  bash
cd server
node server.js


### 7. Start the frontend

Open another terminal:
  
  bash
cd client
npm run dev


The application will be available at:

http://localhost:5173


## Production Deployment

The application is deployed using Render.

### Frontend

React + Vite
        ↓
npm install && npm run build
        ↓
dist/
        ↓
Render

### Backend

Node.js + Express
        ↓
npm install
        ↓
node server.js
        ↓
Render

Environment variables are configured separately for the production environment.


## Example User Workflow

### Customer

Register
   ↓
Login
   ↓
Customer Dashboard
   ↓
Create Support Ticket
   ↓
Select Priority
   ↓
Ticket Created
   ↓
Track Status / SLA
   ↓
Communicate Through Comments


### Support Agent


Login
   ↓
Agent Dashboard
   ↓
View Assigned Tickets
   ↓
Search / Filter Tickets
   ↓
Open Ticket
   ↓
Respond / Update Status
   ↓
Monitor SLA
   ↓
Resolve Ticket


## Engineering Highlights

This project demonstrates practical full-stack development concepts including:

* REST API design
* JWT authentication
* Role-based authorization
* React component architecture
* React state management
* React Router navigation
* PostgreSQL relational data modeling
* SQL queries and joins
* Foreign key relationships
* CRUD operations
* API integration
* SLA calculation and tracking
* Search, filtering, and sorting
* Error and loading-state handling
* Backend security middleware
* Environment-based configuration
* Production deployment
* Git and GitHub workflow


## Future Improvements

Potential enhancements include:

* Real-time ticket updates using WebSockets
* Email notifications
* File and image attachments
* Advanced agent assignment
* Admin dashboard
* Ticket activity timeline
* Audit logs
* Advanced analytics and reporting
* Customer satisfaction ratings
* Automated ticket categorization
* AI-assisted support responses
* Knowledge-base integration


## Project Goals

The primary goal of SupportDesk is to simulate a real-world customer support environment while demonstrating practical full-stack engineering skills.

The project emphasizes:

**Authentication → Authorization → Ticket Management → Assignment → SLA Tracking → Agent Workflow → Customer Communication → Production Deployment**


## Author

**Chandra Sekhar Nissankuni**

B.Tech — Electronics & Communication Engineering
National Institute of Technology Andhra Pradesh

Full Stack Web Developer Trainee — NxtWave Intensive Institute

### Connect

* GitHub: https://github.com/ChanduN0143


## License

This project is developed for educational and portfolio purposes.
