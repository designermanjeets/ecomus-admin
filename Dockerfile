# --- Dockerfile (Angular Admin) ---
    FROM node:18-alpine

    # Set the working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json
    COPY package*.json ./
    
    # Install Angular CLI globally & dependencies
    RUN npm install -g @angular/cli
    RUN npm install --legacy-peer-deps
    
    # Copy the rest of your code
    COPY . .
    
    # Build or serve?
    # 1) If you want to build for production:
    # RUN ng build --prod
    # 2) If you want to run the development server (hot reload):
    CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4500"]
    
    # Expose the container port
    EXPOSE 4500
    