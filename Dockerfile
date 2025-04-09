FROM node:18-slim as base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
FROM base as development
RUN npm install
RUN npm install -g nodemon
COPY . .
# Ensure file permissions are set correctly for hot reloading
RUN chmod +x ./node_modules/.bin/ts-node-dev
# Use nodemon as an alternative watcher for better container compatibility
CMD ["npm", "run", "dev"]

# Production build
FROM base as production
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"] 