# Ansible — Server Configuration & Deployment

This directory automates **configuration management** and **application
deployment** for ShipmentHub on the Azure VM provisioned by Terraform.

## Layout

| File | Purpose |
|------|---------|
| `playbook.yml` | **Server configuration** — installs Docker Engine + Compose plugin, enables the service, adds the admin user to the `docker` group, and creates the app directory. |
| `deploy.yml` | **Application deployment** — logs in to the container registry, renders the production Compose file, pulls the latest image, restarts the stack, and health-checks it. |
| `inventory.ini` | Target hosts. Set `ansible_host` to the VM's public IP (Terraform output `vm_public_ip`). |
| `templates/docker-compose.prod.yml.j2` | Production Compose file rendered onto the VM (uses the registry image instead of building locally). |

## Prerequisites

- Ansible on the control node (Linux/macOS/WSL): `sudo apt install ansible`
- SSH access to the VM using the key referenced in `inventory.ini`
- The VM's public IP set in `inventory.ini`

## Usage

Configure the server (install Docker):

```bash
ansible-playbook -i inventory.ini playbook.yml
```

Deploy / update the application (also run by the CD pipeline):

```bash
ansible-playbook -i inventory.ini deploy.yml \
  -e registry_server=<acr>.azurecr.io \
  -e registry_username=<user> \
  -e registry_password=<pass> \
  -e database_url=<postgres-url> \
  -e jwt_secret=<secret>
```

## Docker (application container)

The app ships as a container defined by the repository root `Dockerfile`:

- **Multi-stage build** on `node:20-alpine` — dependencies are installed in a
  builder stage and copied into a slim final image.
- Runs as the **non-root** `node` user for security.
- Exposes port **4000** and includes a **HEALTHCHECK** hitting `/health`.

`docker-compose.yml` runs the API together with a **PostgreSQL 16** database,
with a healthcheck gate so the API only starts once the database is ready.

## Validation status

Validated end-to-end against an Azure VM (Ubuntu 22.04):

- `playbook.yml` installs Docker Engine **29.6.2** + Compose **v5.3.1**; service active.
- Re-running the playbook reports **0 changes** (idempotent).
