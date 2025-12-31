FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies (SAFE for CI/CD)
RUN npm install --legacy-peer-deps --omit=dev

# Copy application source code
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "index.js"]
