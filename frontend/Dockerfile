# Use official Node.js image as base
FROM node:20.14.0

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other files into the container
COPY . .

# Expose frontend port
EXPOSE 5173

# Start frontend application
CMD ["npm", "run", "dev", "--", "--host"]
