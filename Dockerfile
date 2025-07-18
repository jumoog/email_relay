FROM oven/bun:1.2.18-alpine

WORKDIR /relay

RUN apk update && apk add --no-cache tini

COPY . .
RUN bun install --production --ignore-scripts
ENTRYPOINT ["tini", "--"]
CMD ["bun", "app.ts"]

EXPOSE 25