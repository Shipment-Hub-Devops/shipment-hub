# this first installs the dependencies 
# I changed this from Node-18 to Node 20 because thats the one Esther set up  in our workflow 
FROM node:20-alpine AS builder 

# Sets the working directory for the build context 
WORKDIR /app

# Copies only the package files first ( based off the docker docs to use caching instead for dependencies to speed up builds )
COPY api/package*.json ./

# Installs the dependencies defined in package-lock.json, but omits dev dependencies to reduce image size
RUN npm ci --omit=dev

# Migration runner stage.
# sequelize-cli is a devDependency and is deliberately kept OUT of the runtime
# image: it pulls in js-beautify -> minimatch -> brace-expansion, which would
# reintroduce high-severity findings into the production dependency audit.
# Built and run as a separate one-off container by ansible/deploy.yml.
# Declared before the runtime stage so `docker build .` still defaults to the app.
FROM node:20-alpine AS migrator

WORKDIR /app

# Full dependency install here - sequelize-cli is required to apply migrations
COPY api/package*.json ./
RUN npm ci

# .sequelizerc resolves config/migrations/seeders paths relative to the workdir
COPY api/.sequelizerc ./
COPY api/src/ ./src/

RUN chown -R node:node /app
USER node

# Invoke the binary directly rather than via `npm run` to avoid npm needing a
# writable cache directory when running as the unprivileged node user.
CMD ["node_modules/.bin/sequelize-cli", "db:migrate"]

# Second, we copy the rest of the application code into the image
# Starts a fresh image from the same Node 20 base image to keep the final image size small
FROM node:20-alpine

# Sets the working directory for the final image
WORKDIR /app

# Copies the installed dependencies from the first stage into the final image
COPY --from=builder /app/node_modules ./node_modules

# Copy the rest of the required files app code into the final image, including the source code and any config files 
COPY api/package*.json ./
COPY api/src/ ./src/
COPY api/.sequelizerc ./

# Transfers the ownership of the /app directory to the node user to prevent permission issues when running the app
RUN chown -R node:node /app

# Remove npm from the runtime image. The container starts the app with `node`
# directly and never installs anything, so a package manager here is dead
# weight — and npm vendors its own copy of `tar`, which is the only CRITICAL
# Trivy reports against this image (CVE-2026-59873). Dropping npm removes the
# finding at source rather than suppressing it.
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx

# Switches to the non-root node user for security reasons
USER node

# Makes the app accessible on port 4000, which is the port the app listens on
EXPOSE 4000

# Healthcheck to make sure the container is running and the app is responsive. 
# It checks the /health endpoint every 30 seconds, with a timeout of 5 seconds, starting after an initial delay of 5 seconds, and will retry up to 3 times before considering the container unhealthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Starts the Node.js server
CMD ["node", "src/server.js"]
