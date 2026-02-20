# Frontend Next.js
FROM node:20-alpine

WORKDIR /app

# Copy package files et installer dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Run Next.js SSR
CMD ["npm", "start"]
