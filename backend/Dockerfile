# Backend Dockerfile for FlatBuddy System
FROM node:20-bullseye-slim

# Set working directory
WORKDIR /app

# Install dependencies for native modules (crypto, bcrypt, etc.)
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Copy package files (Skip lockfile to force fresh resolution)
COPY package.json ./

# Install dependencies (SAFE for CI/CD)
# Added --verbose to debug hangs
RUN npm install --legacy-peer-deps --omit=dev --verbose

# Copy application source code
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

# Expose backend port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start backend
CMD ["node", "index.js"]
