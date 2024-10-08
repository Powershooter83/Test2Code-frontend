FROM node:18.19.1 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

FROM nginx:latest
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
EXPOSE 443

