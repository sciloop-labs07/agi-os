# Reproducible full-runtime image for Render Free.
# Node 22 runs Next.js; Python 3.13 runs the bounded Maths AI verifier.
FROM node:22-bookworm AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate
RUN npm run build
RUN npm prune --omit=dev

FROM python:3.13-slim-bookworm AS runtime

ENV NODE_ENV=production
ENV PYTHON=python3
ENV NEXT_DIST_DIR=.next-build
ENV MATHS_AI_DATABASE_PATH=/tmp/verified_experiments.sqlite

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next-build ./.next-build
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/next-env.d.ts ./next-env.d.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/maths_ai_ecosystem ./maths_ai_ecosystem
COPY requirements-render-runtime.txt ./

RUN python -m pip install --no-cache-dir --disable-pip-version-check -r requirements-render-runtime.txt

EXPOSE 10000

CMD ["sh", "-c", "npm start -- -p ${PORT:-10000}"]
