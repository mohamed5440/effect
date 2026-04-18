# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a basic nginx config if needed, or use default
# EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
