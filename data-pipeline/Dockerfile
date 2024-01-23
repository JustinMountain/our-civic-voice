# Use a stable node alpine image
FROM node:alpine3.18

# Set working directory
WORKDIR /usr/app

# Install PM2 globally
RUN npm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm ci

# Install ts-node and typescript
RUN npm install -g ts-node typescript

# Copy all files
COPY ./ ./

# Initialize the Database
CMD ["ts-node", "./init.ts"]
