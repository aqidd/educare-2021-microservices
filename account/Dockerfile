FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install dependencies
RUN npm install

EXPOSE 9000
CMD npm start