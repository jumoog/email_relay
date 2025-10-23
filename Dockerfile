FROM oven/bun:1.3.1-alpine

WORKDIR /relay

RUN apk update && apk add --no-cache tini

COPY . .
RUN bun install --production --ignore-scripts
ENTRYPOINT ["tini", "--"]
CMD ["bun", "app.ts"]

EXPOSE 25