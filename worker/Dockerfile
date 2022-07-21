FROM node:lts-alpine as builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run tsc

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder ./app/build ./build
COPY package* ./
RUN npm install --omit=dev
CMD ["npm", "start"]
