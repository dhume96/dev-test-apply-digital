# Prepare the image when build
# also use to minimize the docker image
FROM node:24-alpine as builder

WORKDIR /app
COPY package*.json ./
COPY contentful-res.json ./
RUN npm install
COPY . .
RUN npm run build


# Build the image as production
# So we can minimize the size
FROM node:24-alpine

WORKDIR /app
COPY package*.json ./
COPY contentful-res.json ./
ENV PORT=4000
ENV NODE_ENV=Production
RUN npm install
COPY --from=builder /app/dist ./dist
EXPOSE ${PORT}

CMD ["npm", "run", "start"]