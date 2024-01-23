# Use a stable node alpine image
FROM node:alpine3.18

# # Update package list and install cron
# RUN apt-get update && apt-get install -y cron

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

# Add the cron file to the container
ADD ./cron-nightly /etc/cron.d/nightly-update

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/nightly-update

# Apply cron job
RUN crontab /etc/cron.d/nightly-update

# Start the cron daemon in the foreground
CMD ["crond", "-f"]
