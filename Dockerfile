FROM node:14-alpine as final
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/build ./build

EXPOSE 8080
USER node
ENTRYPOINT ["npm", "start"]