# Stage 1: Building the code
FROM node:19 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the built code
FROM node:19
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/postcss.config.js ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# The handler file should be the entry point for AWS Lambda to invoke.
# Replace 'lambda-handler.js' with the path to your Lambda handler file.
# This file should export a handler function compatible with AWS Lambda's expected interface.
COPY lambda-handler.js ./

# Set the command to run the handler.
# The exact command will depend on how your handler is implemented.
CMD ["node", "lambda-handler.js"]
