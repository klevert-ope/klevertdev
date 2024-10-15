# Stage 1: Building the Svelte Node app

# Start from the official Node.js 22 image based on Alpine Linux
FROM node:22-alpine3.19 AS builder

# Set the working directory to /app
WORKDIR /app

# Set build-time arguments for environment variables
ARG VITE_POSTSAPI_URL
ARG VITE_BEARER_TOKEN

# Copy package.json and package-lock.json files to the working directory
COPY package*.json gsap-bonus.tgz ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the source code to the working directory
COPY . .

# Build the Svelte Node app
RUN npm run build

RUN npm prune --omit=dev

# Stage 2: Running the Svelte Node app

# Start from the official Node.js 22 image based on Alpine Linux
FROM node:22-alpine3.19

# Set the working directory to /app
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
ENV VITE_POSTSAPI_URL=$VITE_POSTSAPI_URL
ENV VITE_BEARER_TOKEN=$VITE_BEARER_TOKEN

# Copy the build artifacts and node_modules directory from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Expose port 3000 for the Svelte Node app
EXPOSE 3000

# Run the Svelte Node app with strict mode and no lazy loading
CMD [ "node", "--no-lazy", "--use-strict", "build" ]
