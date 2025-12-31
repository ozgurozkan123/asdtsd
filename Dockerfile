FROM node:20-slim

WORKDIR /app

# Copy package files first (for Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build Next.js app
RUN npm run build

# Render sets PORT automatically
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Run Next.js in production mode
CMD ["npm", "run", "start"]
