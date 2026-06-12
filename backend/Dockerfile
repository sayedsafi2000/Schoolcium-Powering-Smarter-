FROM node:20-alpine

WORKDIR /app

# Install OS deps needed by some npm packages
RUN apk add --no-cache python3 make g++

# Copy package files first for layer caching
COPY package.json package-lock.json* ./

# Install production deps only
RUN NODE_ENV=development npm ci --include=dev

# Copy source
COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]
