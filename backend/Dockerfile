# Use official Node.js image as base
FROM node:20.14.0

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other files into the container
COPY . .

# Run database seeding
RUN npm run seed

# Expose backend port
EXPOSE 3030

# Start backend application
CMD ["npm", "run", "dev"]
