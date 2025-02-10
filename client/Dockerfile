# Use a Node.js 18 base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy only the package files to leverage Docker cache for faster builds
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files to the working directory (Docker will ignore files in .dockerignore)
COPY . .

# Set environment variables for development
ENV CHOKIDAR_USEPOLLING=true
ENV FAST_REFRESH=true
ENV WATCHPACK_POLLING=true

# Expose port 3000 for the React development server
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
