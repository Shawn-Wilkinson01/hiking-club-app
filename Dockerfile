# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# ---- runtime stage ----
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json .npmrc ./
RUN npm ci --legacy-peer-deps --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
