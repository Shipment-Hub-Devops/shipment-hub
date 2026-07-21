# Security

## What we scan

As part of our DevSecOps integration for ShipmentHub, we added two automated security checks to our CI pipeline. These run automatically on every pull request targeting main, meaning no code can be merged without passing through these checks first.

**1. npm audit** : this checks all the npm packages we use in the API against a public database of known vulnerabilities maintained by the Node.js security team. We configured it to only fail the pipeline on HIGH or CRITICAL severity findings. Lower severity issues are still logged so we can keep track of them.

**2. Trivy** : this is an open source vulnerability scanner by Aqua Security. It scans our Docker image layer by layer, checking the base OS, installed system packages, and application dependencies for known CVEs (Common Vulnerabilities and Exposures). We configured it to report findings without blocking PRs so we can document and track them over time rather than getting permanently blocked by issues outside our control.

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

We set Trivy's exit code to 0 so it reports findings without failing the pipeline. This was a deliberate decision blocking every PR because of OS-level vulnerabilities we can't immediately fix would slow down development without meaningfully improving security right now.

### npm audit results

We ran npm audit against the `api/` dependencies. No HIGH or CRITICAL vulnerabilities were found in any of the packages we depend on. This means our application-level dependencies are clean as of the time of this scan.

## Remediation Plan

| Issue | Severity | Plan | Timeline |
|-------|----------|------|----------|
| Alpine 3.23.4 OS vulnerabilities | HIGH | Update Dockerfile to use latest patched Alpine base image | Before production deployment |

## Found something?

If you discover a security vulnerability in ShipmentHub, please open a GitHub issue with the `security` label and describe what you found in as much detail as possible. 