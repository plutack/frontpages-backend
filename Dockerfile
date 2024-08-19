FROM satantime/puppeteer-node:20.9.0-bookworm

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./


# Install dependencies, including Puppeteer
RUN npm ci --only=production
RUN npx puppeteer browsers install chrome


# Bundle app source
COPY . .

# Create a non-root user and switch to it
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser /app

USER pptruser

# Expose the port your app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]