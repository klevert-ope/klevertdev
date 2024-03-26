# Use a Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json gsap-bonus.tgz ./

# Install dependencies, including the local file dependency
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the project
RUN npm run build

# Expose the port that your Vite server is running on
EXPOSE 5173

# Start the Vite server when the container starts
CMD ["npm", "run", "dev"]
