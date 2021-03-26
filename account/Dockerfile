FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install dependencies
RUN npm install

RUN npm install -g nodemon

EXPOSE 9000
CMD nodemon src/index.js