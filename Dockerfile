FROM node:latest

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /home/node/app

COPY ./package.json .
COPY ./pnpm-lock.yaml .

RUN npm install pnpm -g

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

CMD [ "tail", "-f", "/dev/null" ]
