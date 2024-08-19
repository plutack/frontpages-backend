FROM node:20-buster

# Install Chrome dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    nss \
    freetype2 \
    fonts-freefont-ttf \
    libfontconfig \
    ca-certificates \
    git \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user and group
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Set environment variables
ENV CHROME_BIN=/usr/bin/chromium \
    CHROME_PATH=/usr/lib/chromium/ \
    CHROME_BINARY_PATH=/usr/bin/chromium

WORKDIR /app

# Change ownership of the working directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY . .

# Expose port 5000
EXPOSE 5000

# CMD instruction to start your application
CMD ["npm", "start"]
