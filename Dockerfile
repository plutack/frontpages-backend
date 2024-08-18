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

# Set environment variables
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ \
    CHROME_BINARY_PATH=/usr/bin/chromium-browser


WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY . .