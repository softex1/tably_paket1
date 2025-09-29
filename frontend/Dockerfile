# Use Node image to build frontend
FROM node:20-alpine AS build

# Install bash (optional, safer for npm scripts)
RUN apk add --no-cache bash

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files
COPY . .

# Ensure node_modules binaries are executable
RUN chmod -R +x node_modules/.bin

# Build the project
# RUN npx vite build
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:stable-alpine

# Copy built files to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy custom Nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
