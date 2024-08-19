FROM node:20-buster-slim

# Install Chrome dependencies and create non-root user in one layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    libnss3 \
    libfreetype6 \
    fonts-freefont-ttf \
    libfontconfig1 \
    ca-certificates \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r appgroup && useradd -r -g appgroup appuser

# Set environment variables
ENV CHROME_BIN=/usr/bin/chromium \
    CHROME_PATH=/usr/lib/chromium/ \
    CHROME_BINARY_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

# Copy package files, install dependencies, and copy app files in one layer
COPY --chown=appuser:appgroup package*.json ./
RUN npm ci --only=production
COPY --chown=appuser:appgroup . .

# Switch to the non-root user
USER appuser

# Expose port 5000
EXPOSE 5000

# CMD instruction to start your application
CMD ["npm", "start"]
