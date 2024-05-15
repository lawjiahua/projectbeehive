# Use a node base image
FROM node:14-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local files to app folder
COPY . .

# Build the React app
RUN npm run build

# Use nginx to serve the React app
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outer world
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


# Frontend/Dockerfile without NGINX
# Use an official Node runtime as a parent image
# FROM node:14-alpine

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install any needed packages
# RUN npm install

# # Bundle app source
# COPY . .

# # Build the project for production
# RUN npm run build
# RUN ls -la build

# # Install serve to serve your app on port 3000
# RUN npm install -g serve
# EXPOSE 3000

# # Command to run the app
# CMD ["serve", "-s", "build"]
