# Security

## What we scan

As part of our DevSecOps integration for ShipmentHub, we added two automated security checks to our CI pipeline. These run automatically on every pull request targeting main, meaning no code can be merged without passing through these checks first.

**1. npm audit** : this checks all the npm packages we use in the API against a public database of known vulnerabilities maintained by the Node.js security team. We configured it to only fail the pipeline on HIGH or CRITICAL severity findings. Lower severity issues are still logged so we can keep track of them.

**2. Trivy** : this is an open source vulnerability scanner by Aqua Security. It scans our Docker image layer by layer, checking the base OS, installed system packages, and application dependencies for known CVEs (Common Vulnerabilities and Exposures). We configured it to report findings without blocking PRs so we can document and track them over time rather than getting permanently blocked by issues outside our control.

**3. Checkov** : this is an open source static analysis tool for Infrastructure as Code. It scans our Terraform files for security misconfigurations before any infrastructure is provisioned. We used --soft-fail so findings are reported without blocking the pipeline, allowing us to document and track them.

## What we found

### Trivy scan results

We scanned the image `shipmenthub-api:scan` which is built from our Dockerfile using `alpine 3.23.4` as the base image. Alpine is a lightweight Linux distribution commonly used in Docker images because of its small size.

Trivy found **2 HIGH severity vulnerabilities** in the Alpine base image itself. These are not in our application code or in any of our npm packages, they exist in the OS layer of the image.

| Severity | Count | Location |
|----------|-------|----------|
| HIGH | 2 | alpine 3.23.4 base image |
| CRITICAL | 0 | None found |

### Finding Details

The 2 HIGH severity vulnerabilities were found in the Alpine base image (`alpine 3.23.4`), not in the application code or dependencies.

**Risk assessment:**
These vulnerabilities exist in the base OS layer and are outside the direct control of the application team. They are being monitored and will be addressed by updating the base image when a patched version of Alpine is available.

**Accepted risk rationale:**
Since ShipmentHub is currently in development and not yet deployed to production, these findings are accepted as low immediate risk. The base image will be updated before any production deployment.

We set Trivy's exit code to 0 so it reports findings without failing the pipeline. This was a deliberate decision — blocking every PR because of OS-level vulnerabilities we can't immediately fix would slow down development without meaningfully improving security right now.

### npm audit results

We ran npm audit against the `api/` dependencies. No HIGH or CRITICAL vulnerabilities were found in any of the packages we depend on. This means our application-level dependencies are clean as of the time of this scan.

### Checkov IaC scan results

**Scan date:** July 2026
**Tool:** Checkov
**Scope:** `terraform/` directory

Checkov flagged several findings across the Terraform modules. These are related to recommended security hardening practices such as missing encryption settings on some resources, public access configurations that could be tightened, and resource monitoring and logging not fully configured.

| Finding Type | Severity | Status |
|--------------|----------|--------|
| Missing encryption on resources | MEDIUM | Accepted risk — will address before production |
| Public access configurations | MEDIUM | Accepted risk — will address before production |
| Missing logging/monitoring | LOW | Accepted risk — will address before production |

Since ShipmentHub is a student project and not yet in production, these findings are accepted as known risks for now. All flagged items will be reviewed and addressed before any production deployment.

## Remediation Plan

| Issue | Severity | Plan | Timeline |
|-------|----------|------|----------|
| Alpine 3.23.4 OS vulnerabilities | HIGH | Update Dockerfile to use latest patched Alpine base image | Before production deployment |
| Missing encryption on Terraform resources | MEDIUM | Add encryption settings to all applicable resources | Before production deployment |
| Public access configurations in Terraform | MEDIUM | Tighten NSG and security group rules | Before production deployment |
| Missing logging and monitoring in Terraform | LOW | Add diagnostic settings and logging configuration | Before production deployment |

## Summative deployment — security decisions (31 July 2026)

Deploying to the live Azure environment surfaced three findings that supersede
parts of the sections above. Each is recorded here with what we actually did.

### 1. CRITICAL in the runtime image — FIXED

The table above reports "CRITICAL: 0". That is no longer accurate. Trivy now
reports one CRITICAL against the API image:

| CVE | Package | Path |
|-----|---------|------|
| CVE-2026-59873 | tar 6.2.1 → 7.5.19 | `usr/local/lib/node_modules/npm/node_modules/tar` |

The package is not one of ours. `npm ls tar --omit=dev` returns empty — it is
vendored inside the copy of **npm** that ships in the `node:20-alpine` base
image.

**Action taken: fixed, not accepted.** The runtime container starts the app
with `node` directly and never installs anything, so npm has no purpose there.
The Dockerfile now deletes npm from the final stage, which removes the
vulnerable code from the image entirely rather than suppressing the alert. This
also shrinks the image.

### 2. SSH exposed to the internet — ACCEPTED RISK

The bastion NSG previously permitted SSH only from a single operator's home IP
address. That has been widened to `Internet`.

**Why the restriction could not be kept:**

- The CD pipeline deploys from GitHub-hosted runners, which take an
  unpredictable address from a large pool on every run. A fixed allow-list
  cannot admit them, and GitHub's published ranges are thousands of CIDRs that
  rotate — impractical to encode in an NSG.
- A single home address also excluded every other team member, and broke
  whenever that address was reassigned by the ISP.

**Compensating controls** (applied by `ansible/playbook.yml`, verified on the
running host):

| Control | Setting |
|---------|---------|
| Password authentication | `no` — key-only, so password guessing cannot succeed |
| Root login | `PermitRootLogin no` |
| Failed attempts per connection | `MaxAuthTries 3` |
| Host firewall | UFW default-deny inbound |

**Residual risk:** automated scanners will attempt connections and generate log
noise. Without the corresponding private key they cannot authenticate. Only the
bastion is exposed; the application VM has no public IP and its NSG accepts
traffic solely from inside the VNet.

**Preferred long-term fix:** have the pipeline add a temporary NSG rule scoped
to the runner's own address for the duration of a deploy and remove it
afterwards, returning the default state to closed. This needs an Azure service
principal and was judged too large a change for the current deadline.

**To revert:** set `source_address_prefix` back to `var.my_public_ip` in
`terraform/modules/security/main.tf`. The variable is still declared and wired
through, so no other change is required.

### 3. npm audit scope — corrected

The claim above that npm audit found no HIGH or CRITICAL issues needs
qualifying. The **production** dependency tree is clean, which is what both
pipelines now gate on (`npm audit --audit-level=high --omit=dev`). The full
tree including devDependencies reports 29 HIGH, all tracing to a single
advisory (GHSA-mh99-v99m-4gvg in `brace-expansion`) reached only through build
tooling — eslint, jest, sequelize-cli and nodemon — none of which ships in the
runtime image. The full-tree audit still runs in CI as a non-blocking step so
these stay visible.

## Found something?

If you discover a security vulnerability in ShipmentHub, please open a GitHub issue with the `security` label and describe what you found in as much detail as possible.