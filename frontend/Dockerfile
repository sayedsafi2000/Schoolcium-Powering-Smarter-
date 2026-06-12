FROM node:20-alpine

WORKDIR /app

# Declare ARG first — must be before ENV so build-time value is used
ARG NEXT_PUBLIC_API_URL=https://schoolciumserver.pixelsbee.com/api

# Bake into the image as ENV so Next.js picks it up during `next build`
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

# Build — NEXT_PUBLIC_* is statically replaced at this step
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["./node_modules/.bin/next", "start", "-p", "3000", "-H", "0.0.0.0"]
