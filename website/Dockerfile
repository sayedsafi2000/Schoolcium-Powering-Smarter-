FROM node:20-alpine

WORKDIR /app

# Build-time env vars — passed from docker-compose as ARG
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ARG NEXT_PUBLIC_SCHOOL_NAME=Ideal Vision Academy
ARG NEXT_PUBLIC_SCHOOL_PHONE=01773-763422
ARG NEXT_PUBLIC_SCHOOL_EMAIL=idealvisionacademy@gmail.com
ARG NEXT_PUBLIC_SCHOOL_ADDRESS=Badaghat, Sunamganj, Bangladesh

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SCHOOL_NAME=$NEXT_PUBLIC_SCHOOL_NAME
ENV NEXT_PUBLIC_SCHOOL_PHONE=$NEXT_PUBLIC_SCHOOL_PHONE
ENV NEXT_PUBLIC_SCHOOL_EMAIL=$NEXT_PUBLIC_SCHOOL_EMAIL
ENV NEXT_PUBLIC_SCHOOL_ADDRESS=$NEXT_PUBLIC_SCHOOL_ADDRESS
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./

# Install all deps including devDeps (needed for next build)
RUN NODE_ENV=development npm ci --include=dev

COPY . .

# Build Next.js app
RUN NODE_ENV=production ./node_modules/.bin/next build

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

EXPOSE 3001

CMD ["./node_modules/.bin/next", "start", "-p", "3001", "-H", "0.0.0.0"]
