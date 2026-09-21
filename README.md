# SupportDesk – Customer Support & SLA Management System

SupportDesk is a full-stack customer support platform that allows customers to create and track support tickets while support agents manage, assign, update, and resolve tickets based on SLA timelines.

The project was built to demonstrate practical full-stack development, REST API design, authentication, role-based access control, PostgreSQL database integration, and SLA management.

## 🚀 Features

### Customer Features

- User registration and login
- JWT-based authentication
- Create support tickets
- Select ticket priority
- View personal tickets
- Search tickets
- Filter tickets by status, priority, and SLA
- Sort tickets
- View ticket details
- Add comments
- Track ticket status
- View SLA information
- Customer dashboard statistics

### Agent Features

- Secure agent login
- Agent dashboard
- View assigned tickets
- Assign tickets to self
- Update ticket status
- Add ticket comments
- Track first response time
- Monitor SLA status
- Search, filter, and sort tickets
- Agent dashboard statistics
- Resolve support tickets

## ⏱️ SLA Management

SupportDesk automatically calculates SLA deadlines based on ticket priority:

| Priority | SLA |
|----------|-----|
| Urgent | 4 hours |
| High | 8 hours |
| Medium | 24 hours |
| Low | 48 hours |

The system tracks:

- SLA due time
- First response time
- Resolution time
- SLA breach status
- Resolution within SLA
- Resolution after SLA

## 🔐 Authentication & Security

- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Environment variables for secrets
- PostgreSQL parameterized queries
- Helmet security headers
- CORS support
- Protected customer and agent operations

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- React Router

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt
- Helmet
- CORS

### Database

- PostgreSQL

## 📁 Project Structure

```text
supportdesk/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── authMiddleware.js
│   ├── authRoutes.js
│   ├── db.js
│   ├── ticketRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md