FROM node:20

WORKDIR /app

ARG NPM_REGISTRY=https://registry.npmjs.org/
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY}

COPY package*.json ./
RUN npm install --no-fund --no-audit --loglevel=error --registry=${NPM_REGISTRY}

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
