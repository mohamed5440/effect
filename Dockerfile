FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the React frontend (creates the dist folder)
RUN npm run build

# Expose the port the Express server runs on
EXPOSE 5000

# Start the Express server
CMD ["node", "server/index.cjs"]
