# Use official Node.js image with the specified version
FROM node:18.19.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build TypeScript code
RUN yarn build

# Expose the port that the application runs on
EXPOSE 5000

# Command to run the application
CMD ["yarn", "start"]
