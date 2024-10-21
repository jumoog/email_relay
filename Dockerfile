FROM oven/bun:1.1.32-alpine

WORKDIR /relay
COPY . .
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 /bin/dumb-init
RUN bun install --production --ignore-scripts &&\
    chmod +x /bin/dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["bun", "app.ts"]

EXPOSE 25