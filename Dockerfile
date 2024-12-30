FROM oven/bun:1-alpine AS base

RUN apk add --no-cache curl bash ca-certificates wget

# Install glibc to run Bun
RUN if [[ $(uname -m) == "aarch64" ]] ; \
    then \
    # aarch64
    wget https://raw.githubusercontent.com/squishyu/alpine-pkg-glibc-aarch64-bin/master/glibc-2.26-r1.apk ; \
    apk add --no-cache --allow-untrusted --force-overwrite glibc-2.26-r1.apk ; \
    rm glibc-2.26-r1.apk ; \
    else \
    # x86_64
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.28-r0/glibc-2.28-r0.apk ; \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub ; \
    apk add --no-cache --force-overwrite glibc-2.28-r0.apk ; \
    rm glibc-2.28-r0.apk ; \
    fi


WORKDIR /app

FROM base AS builder

COPY package.json ./

RUN bun install

COPY . .

RUN bun run build

FROM base AS runner

COPY --from=builder /app/dist/index.js /app/index.js

HEALTHCHECK --interval=10s --timeout=10s --start-period=5s --retries=3 CMD [ "curl", "-f", "http://localhost:8080/health" ]

EXPOSE 9000
EXPOSE 8000

CMD ["bun", "/app/index.js", "server"]
