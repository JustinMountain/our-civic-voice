# Use a stable node alpine image
FROM node:alpine3.18

# Set working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm ci

# Install ts-node and typescript
RUN npm install -g ts-node typescript express

# Copy all files
COPY ./ ./

# Expose the listening port
EXPOSE 3000

# Change ownership of the /usr/app directory to the node user
RUN chown -R node:node /usr/app

# Run container as non-root (unprivileged) user to follow principle of least privilege
USER node

# Initialize the Database
CMD ["./init/init.sh"]
