FROM node:18-slim

# Install dependencies for standalone Chrome browser
RUN apt-get update && apt-get install -y wget gnupg2 ca-certificates

# Download and install standalone Chrome browser
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update && apt-get install -y google-chrome-stable

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN npm run build

# Run the npm run dev command
CMD ["npm", "run", "dev"]