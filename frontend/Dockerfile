FROM node:20-alpine

WORKDIR /app

# Build-time env var — passed from docker-compose as ARG
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./

# Install all deps including devDeps (needed for next build)
RUN NODE_ENV=development npm ci --include=dev

COPY . .

# Build Next.js app
RUN NODE_ENV=production ./node_modules/.bin/next build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["./node_modules/.bin/next", "start", "-p", "3000", "-H", "0.0.0.0"]
