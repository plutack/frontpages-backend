FROM satantime/puppeteer-node:20.9.0-bookworm

ENV NODE_ENV=production

WORKDIR /app

# Install cron
RUN apt-get update && apt-get install -y cron

# Install dependencies and Puppeteer
COPY package*.json ./
RUN npm ci --omit=dev && npx puppeteer browsers install chrome

# Copy application files
COPY . .

# Create a cron job to kill Chrome every 5 minutes
RUN echo "*/5 * * * * pkill chrome" > /etc/cron.d/kill_chrome

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/kill_chrome

# Apply the cron job
RUN crontab /etc/cron.d/kill_chrome

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Expose the application's port
EXPOSE 5000

# Start the cron service and the application
CMD cron && npm start
