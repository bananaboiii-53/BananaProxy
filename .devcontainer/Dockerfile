# Use the official Node.js image
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-14

# Set the working directory
WORKDIR /workspace

# Install dependencies
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the proxy server
CMD ["node", "server.js"]
