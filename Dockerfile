FROM node:20-alpine

# Install Chrome dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    git

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set environment variables
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ \
    CHROME_BINARY_PATH=/usr/bin/chromium-browser

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
