FROM node:20-alpine

#ENV NODE_ENV production


# Set the working directory in the container to /app
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and package-lock.json to the workdir
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install your application's dependencies
RUN pnpm install

# Bundle your app's source code inside the Docker image
COPY . .

# Make port 20152 available outside the container
EXPOSE 20152

# Run migrations
RUN pnpm db:migrate

# Run seeders - this of course will be removed when the time come to go to production
RUN pnpm db:seed

# Start the application
RUN pnpm build

COPY . .

CMD [ "pnpm", "start:prod" ]
