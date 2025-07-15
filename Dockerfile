# base image
FROM node:14

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application code
COPY . .

# expose port
EXPOSE 3000

# start the application
CMD ["npm", "start"]