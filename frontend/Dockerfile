# ---- Stage 1: Build Angular ----
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration=production

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine
# Copy built Angular app
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
