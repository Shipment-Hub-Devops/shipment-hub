# ShipmentHub
Coordinate your shipments and give customers real-time visibility from pickup to delivery 

## Our Problem Statement 

Across many African countries, freight coordination still relies heavily on phone calls, messaging applications, and spreadsheets. This often results in poor communication, delayed updates, and limited visibility into shipment progress.

Customers frequently do not know where their cargo is, while operations teams spend significant time manually providing updates. ShipmentHub addresses this challenge by centralising shipment management, enabling real-time tracking, and improving communication between clients, operators, and recipients.

## Target Users 

- Clients: Businesses or individuals who need goods transported and want visibility into their shipment status
- Operations Teams: Staff responsible for coordinating shipments, updating shipment statuses, and monitoring delivery progress
- Customers and Recipients: Anyone who receives a tracking link and wants to follow the progress of a shipment without creating an account

## Core Features 

- User Authentication and Role Management: Secure login using JWT authentication with role-based access for clients and operators
- Shipment Requests: Clients can create shipment requests, provide cargo details, and specify pickup and delivery locations using an interactive map
- Operations Dashboard: Operators can manage all shipments from a single dashboard and monitor shipment activity in real time
- Status and Location Updates: Operators can manage all shipments from a single dashboard and monitor shipment activity in real time
- Public Shipment Tracking: Customers can track shipments through a secure shareable link without needing to create an account

## Technology Stack 
- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, Leaflet
- Backend: Node.js, Express.js, Sequelize ORM, JWT Authentication, Joi Validation, Helmet
- Database: PostgreSQL
- Testing: Jest, Supertest 
