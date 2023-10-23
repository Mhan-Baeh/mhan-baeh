# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.jsonHw9-(if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle the app's source code inside the Docker image
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start" ]
