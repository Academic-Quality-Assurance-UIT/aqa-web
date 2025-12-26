FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

ARG NEXT_PUBLIC_API_URL_V2
ENV NEXT_PUBLIC_API_URL_V2=$NEXT_PUBLIC_API_URL_V2

ARG BACKEND_URL=http://host.docker.internal:8000/graphql
ENV BACKEND_URL=$BACKEND_URL

RUN pnpm build --no-lint

FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "run", "start"] 
