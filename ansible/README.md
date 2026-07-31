# Ansible — Server Configuration & Deployment

This directory automates **configuration management** and **application
deployment** for ShipmentHub on the Azure VM provisioned by Terraform.

## Layout

| File | Purpose |
|------|---------|
| `playbook.yml` | **Server configuration** — installs Docker Engine + Compose plugin, enables the service, adds the admin user to the `docker` group, creates the app directory, configures a **UFW firewall** (default-deny inbound; allows SSH + app port) and applies **SSH hardening** (key-only auth, no root login). |
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

## Continuous Deployment (`.github/workflows/cd.yml`)

On every push to `main`, the CD pipeline:

1. Calls `ci.yml` as a reusable workflow (`workflow_call`) to re-run lint,
   tests, and the security scans — a merge is not deployed if any of these fail.
2. Authenticates to Azure (`azure/login`) and builds/pushes the API image to
   ACR, tagged with the commit SHA.
3. Generates a throwaway Ansible inventory (never commit real IPs) that routes
   SSH to the private app VM through the bastion (`ProxyCommand`), then runs
   `deploy.yml` with the new image tag, registry credentials, and app secrets.

`playbook.yml` is **not** run by CD — it's one-time server bootstrapping
applied manually after `terraform apply`, before the first deploy.

### Required GitHub Actions secrets (Settings > Secrets and variables > Actions > Secrets)

| Secret | Value |
|---|---|
| `AZURE_CREDENTIALS` | JSON service principal credentials (see below) used for `azure/login` |
| `REGISTRY_USERNAME` | ACR admin username — `terraform output registry_admin_username` |
| `REGISTRY_PASSWORD` | ACR admin password — `terraform output registry_admin_password` (sensitive) |
| `SSH_PRIVATE_KEY` | Private key matching the `ssh_public_key` Terraform put on both VMs |
| `DATABASE_URL` | Postgres connection string for the managed DB — `terraform output database_fqdn` plus credentials |
| `JWT_SECRET` | Application JWT signing secret |
| `POSTGRES_PASSWORD` | Used by the `backend` CI job's test Postgres service |

### Required GitHub Actions variables (same page, "Variables" tab — not secret, but repo-specific)

| Variable | Value |
|---|---|
| `ACR_NAME` | Registry short name, e.g. `shipmenthubacr` (used by `az acr login --name`) |
| `ACR_LOGIN_SERVER` | `terraform output registry_login_server`, e.g. `shipmenthubacr.azurecr.io` |
| `BASTION_HOST` | `terraform output bastion_public_ip` |
| `APP_VM_PRIVATE_IP` | `terraform output app_vm_private_ip` |
| `SSH_USER` | VM admin username, e.g. `azureadmin` |

Re-run the relevant `terraform output` command and update these values whenever
infrastructure is re-provisioned (a new `terraform apply` can change the
bastion's public IP).

### Creating the `AZURE_CREDENTIALS` service principal

```bash
az ad sp create-for-rbac \
  --name shipment-hub-cd \
  --role AcrPush \
  --scopes /subscriptions/<subscription-id>/resourceGroups/<resource-group> \
  --sdk-auth
```

Paste the full JSON output (`clientId`, `clientSecret`, `subscriptionId`,
`tenantId`) as the `AZURE_CREDENTIALS` secret. `AcrPush` scoped to the resource
group is enough for `az acr login` + `docker push`; it does not grant access to
the VM or database.

## Validation status

Validated end-to-end against an Azure VM (Ubuntu 22.04):

- `playbook.yml` installs Docker Engine **29.6.2** + Compose **v5.3.1**; service active.
- UFW active (default-deny inbound; `22` and `4000` allowed) and SSH hardened
  (`PermitRootLogin no`, `PasswordAuthentication no`).
- Re-running the playbook reports **0 changes** (idempotent).
