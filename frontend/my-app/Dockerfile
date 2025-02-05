# Step 1: Use an official Node.js image as a base
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application files into the container
COPY . .

# Step 6: Expose the port the app will run on (default for Vite is 5173)
EXPOSE 5173

# Step 7: Run the app (use npm run dev)
CMD ["npm", "run", "dev"]
