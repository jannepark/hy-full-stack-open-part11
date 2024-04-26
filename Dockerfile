# Use an official Node.js runtime as a parent image
FROM node:21.6.0

# Set the working directory in the container
WORKDIR /app

# Copy the backend package.json and install dependencies
COPY package.json ./
RUN npm install 
# Copy the backend code into the container
COPY . .

# Set up and build the frontend
# WORKDIR /app/frontend

# Copy the frontend package.json and install dependencies
WORKDIR /app/frontend
COPY ./frontend/package.json ./
 # Make sure paths are correct
# COPY frontend/package-lock.json* ./  # Uncomment this if using package-lock.json
RUN npm install 

# Build the frontend
RUN npm run build
RUN npm prune --omit=dev
# Move the built files to the served directory
RUN mv build /app/public  
# Adjust this based on how you serve static files in your backend

# Go back to the main app directory
WORKDIR /app

# Expose the ports the app runs on
EXPOSE 3000

# Command to run the backend server
CMD [ "npm", "run", "start" ]


