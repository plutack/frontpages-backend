FROM satantime/puppeteer-node:20.9.0-bookworm

ENV NODE_ENV=production

WORKDIR /app

# Install cron and supervisor
RUN apt-get update && apt-get install -y cron supervisor

# Install dependencies and Puppeteer
COPY package*.json ./
RUN npm ci --omit=dev && npx puppeteer browsers install chrome

# Copy application files
COPY . .

# Create a cron job to run job.js every day at 15:00
RUN echo "0 15 * * * /usr/local/bin/node /app/cron/job.js >> /var/log/cron.log 2>&1" > /etc/cron.d/run_job

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/run_job

# Apply the cron job
RUN crontab /etc/cron.d/run_job

# Create the log file for cron
RUN touch /var/log/cron.log

# Copy supervisord config file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the application's port
EXPOSE 5000

# Start supervisord
CMD ["/usr/bin/supervisord"]
