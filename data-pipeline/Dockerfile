# Use a stable node alpine image
FROM node:alpine3.18

# Set working directory
WORKDIR /usr/app

# # Install PM2 globally
# RUN npm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm ci

# Install ts-node and typescript
RUN npm install -g ts-node typescript

# Copy all files
COPY ./ ./

# # Add the cron file to the container
# ADD ./init/cron-nightly /etc/cron.d/nightly-update

# # Give execution rights on the cron job
# RUN chmod 0644 /etc/cron.d/nightly-update

# RUN chmod u+s /usr/bin/crontab

# # Apply cron job
# RUN crontab /etc/cron.d/nightly-update

# # Change ownership of the /usr/app directory to the node user
# RUN chown -R node:node /usr/app

# # Run container as non-root (unprivileged) user to follow principle of least privilege
# USER node

# RUN /usr/local/bin/ts-node /usr/app/init/init.ts


# # Initialize the Database
# CMD ["./init/init.sh"]
