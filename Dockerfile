FROM satantime/puppeteer-node:20.9.0-bookworm

ENV NODE_ENV=production

WORKDIR /app

# Create a non-root user
# RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
#     && mkdir -p /home/pptruser/Downloads \
#     && chown -R pptruser:pptruser /home/pptruser

COPY package*.json ./

# Install dependencies and Puppeteer
RUN npm ci --omit=dev \
    && npx puppeteer browsers install chrome

# Copy application files and set permissions
COPY . .
# RUN chown -R pptruser:pptruser /app

# Enable unprivileged user namespaces
RUN sudo sysctl -w kernel.unprivileged_userns_clone=1

# Switch to non-root user
# USER pptruser

EXPOSE 5000

CMD ["npm", "start"]