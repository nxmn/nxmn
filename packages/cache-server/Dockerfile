FROM node:17-alpine3.15 as builder

WORKDIR /app
COPY ./output .
RUN npm install --production --no-audit --no-progress

FROM node:17-alpine3.15 as cache-server

WORKDIR /app
COPY --from=builder /app .

ENV PORT=3333
EXPOSE ${PORT}

ENV NXMN_CACHE_DIR=/app/cache
VOLUME ${NXMN_CACHE_DIR}

CMD ["node", "./src/main.js"]
