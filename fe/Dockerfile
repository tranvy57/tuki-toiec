# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy env + source code
COPY . .
COPY .env.production .env

RUN npm run build

# Stage 2: Serve
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
