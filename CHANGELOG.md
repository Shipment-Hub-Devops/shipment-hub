# Changelog

All notable changes to ShipmentHub across the course milestones.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Summative] — In progress

Full end-to-end "Git-to-Production" DevOps pipeline.

### Added
- **Infrastructure as Code (Terraform)** — Azure resource group, virtual
  network, subnet, network security group, public IP, NIC, and Linux VM
  (`terraform/`).
- **Configuration management (Ansible)** — `playbook.yml` installs Docker
  Engine + Compose and prepares the host; `deploy.yml` deploys the app from the
  container registry (`ansible/`).

### Planned / TODO
- Container registry (ACR) in Terraform.
- Managed PostgreSQL database and bastion host.
- DevSecOps scanning in CI (image scan + IaC scan, e.g. Trivy + tfsec).
- Continuous Deployment workflow (build → push → run Ansible on merge to `main`).
- README operations manual with architecture diagram and live app URL.

## [Formative 2] — Containerisation & CI

### Added
- **Dockerfile** — multi-stage `node:20-alpine` image, non-root user, healthcheck.
- **docker-compose.yml** — API + PostgreSQL 16 with a database healthcheck gate.
- **CI pipeline** (GitHub Actions) — lint and test on every push and pull request.
- **ESLint** configuration and `lint` script for the backend.

## [Formative 1] — Project Foundation

### Added
- GitHub repository, project board, and branch protection rules.
- Express API with authentication, shipments, and tracking endpoints.
- Sequelize models, migrations, and seeders (PostgreSQL).
- Initial test suite and setup documentation.
