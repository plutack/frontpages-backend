FROM satantime/puppeteer-node:20.9.0-bookworm

ENV NODE_ENV=production

WORKDIR /app

# Install cron
RUN apt-get update && apt-get install -y cron

# Install dependencies and Puppeteer
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Expose the application's port
EXPOSE 5000

# Start the cron service and the application
CMD cron && npm start
