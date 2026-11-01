FROM node:20-alpine
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

# Run DB migrations, then start the API
CMD ["sh", "-c", "npm run knex migrate:latest && npx ts-node src/index.ts"]