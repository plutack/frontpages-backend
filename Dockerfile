FROM satantime/puppeteer-node:20.9.0-bookworm

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

# Create a non-root user earlier in the process
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser

# Copy application files and set permissions
COPY . .
RUN chown -R pptruser:pptruser /app

# Switch to non-root user
USER pptruser

# Install dependencies and Puppeteer
RUN npm ci --omit=dev \
    && npx puppeteer browsers install chrome

EXPOSE 5000

CMD ["npm", "start"]