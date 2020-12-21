FROM node:alpine
RUN npm install -g serve
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["serve", "-l", "4000", "-s", "build"]