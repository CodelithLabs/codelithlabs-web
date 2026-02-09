# Use Node 20 (LTS)
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# --- THIS IS THE MISSING LINE ---
RUN npm run build
# -------------------------------

# Start the app
CMD ["npm", "start"]