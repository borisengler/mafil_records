FROM node:alpine3.11

RUN mkdir -p /app/frontend

WORKDIR /app/frontend

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages
RUN npm install

COPY . .

# Expose $PORT on container.
EXPOSE $PORT

# Start the app
CMD [ "npm", "start" ]