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

## Running with Docker Compose

To run the application locally with Docker Compose:

1. Copy the root environment example file to `.env` and adjust the values if needed:
   ```bash
   copy .env.example .env
   ```
2. Start the services from the repository root:
   ```bash
   docker compose up --build
   ```
3. The API should be available at `http://localhost:4000`.
4. To stop the services:
   ```bash
   docker compose down
   ```
5. To remove the persisted database volume as well:
   ```bash
   docker compose down -v
   ```

The root `.env.example` file is used by Docker Compose. If you also want to run the API directly from the `api/` folder for local development, you can use the example file at `api/.env.example`.

## Branch Protection (main)

The `main` branch is protected to enforce our DevOps review workflow:

- **Require pull request + 1 approval** — no code reaches main without peer review.
- **Dismiss stale approvals** — re-review is forced if new commits are pushed after approval.
- **Require status checks** — CI must pass before merge (checks added in F2).
- **Require branches up to date** — prevents broken merges from out-of-date branches.
- **Require conversation resolution** — all review comments must be addressed.
- **Include administrators** — rules apply to everyone, no exceptions.

## Local Development with Docker

You can run the entire ShipmentHub backend architecture locally using Docker. This ensures you have the exact same Node.js and PostgreSQL environment as the rest of the team.

### Prerequisites
- Docker Desktop installed and running
- Git installed

### Step 1: Clone the repository
```bash
git clone [https://github.com/your-username/shipmenthub.git](https://github.com/your-username/shipmenthub.git)
cd shipmenthub

## Step 2: Configure Environment Variables

Create a `.env` file in the root of the project repository (the same directory as `docker-compose.yml`) and add the following environment variables:

```env
DATABASE_URL=postgres://postgres:postgres@db:5432/shipmenthub_dev
JWT_SECRET=add-a-secure-local-secret-here
JWT_EXPIRES_IN=7d
```

## Step 3: Start the Application

Build the multi-stage Docker images and start the application containers in the background:

```bash
docker-compose up --build -d
```

## Step 4: Verify the Application

The API waits for the PostgreSQL database to become healthy before starting.

Once the containers are running, verify that the API is healthy by opening the following endpoint in your browser:

**API Health Check:** http://localhost:4000/health

If everything is configured correctly, you should receive a successful health check response.

## Step 5: Stop the Application

To stop the application, shut down all running containers, and remove the custom Docker network, run:

```bash
docker-compose down
```