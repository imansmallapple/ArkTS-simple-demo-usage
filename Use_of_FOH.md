# Use of F-OH-Store

### Disclaimer

The following guide provides a general set of steps for deploying f-oh-data and using f-oh-store. You should adjust these steps based on your development and debugging.

### Step 1: Prepare the Dockerfile

**View the Source Code:**

1. Compile the Source Code of the App to HAP in DevEco Studio
   - Build-Build HAP/APP- Build HAP
2. **Access the Repository:**
- Visit the `f-oh-data` repository on Gitee and download the latest code.
3. **Understand Dependencies and Environment Requirements:**
- Examine the f-oh-data project to identify its dependencies and environmental needs, for example, `npm`, `node.js`

**Write the Dockerfile:**

1. **Base Image:**
   
   - Choose an appropriate base image, such as `node:14-alpine` for Node.js  depending on the `f-oh-data’`s requirements.

2. **Set Environment:**
   
   - Set the working directory using `WORKDIR /app`.

3. **Install Dependencies:**
   
   - Copy the source code into the image and install dependencies. For a Node.js application, use:
     
     ```
     COPY . /app
     RUN npm install
     ```

4. **Expose Ports:**
   
   - Use `EXPOSE 8080` to specify the port the application will listen on.

5. **Set Start Command:**
   
   - Define the command to run when the container starts, for example:
     
     ```
     CMD ["node", "server.js"]
     ```

### Step 2: Deploy the Server

**Build the Image:**

- Use the Dockerfile to build the Docker image with the following command:
  
  ```bash
  docker build -t f-oh-data .
  ```

**Run the Container:**

- Deploy the container on your server using:
  
  ```bash
  bashCopy code
  docker run -d -p 80:8080 f-oh-data
  ```
  
  - `d` indicates running the container in detached mode (background).
  - `p 80:8080` maps the container’s port 8080 to the server’s port 80.

## Add new app into the store

1. Compile the Source Code of the App to HAP in DevEco Studio
   
   - Build-Build HAP/APP- Build HAP

2. **Update the App into the f-oh-data project :**
- Visit local code of `f-oh-data`

- Add a new item in the array of `f-oh-data/allAppList.json` in the format of
  
  ```bash
      {
          "id": 0,
          "name": "F-OH",
          "desc": "F-OH is an application center for FOSS (Free and Open Source Software) on the OpenHarmony platform",
          "icon": "/data/org.ohosdev.foh/icon.png",
          "vender": "@westinyang",
          "packageName": "org.ohosdev.foh",
          "version": "1.3.5",
          "hapUrl": "/data/org.ohosdev.foh/F-OH-1.3.5.hap",
          "type": "app",
          "tags": "Essential Apps, App Center, App Market",
          "openSourceAddress": "https://gitee.com/westinyang/f-oh",
          "releaseTime": "2023-04-11"
      },
  ```

- Copy the HAP file of the app into the `f-oh-data/data` folder, it should match the `“hapUrl”`

- Update your dockerfile and bring up the server to make change come to effect 

# Example of F-OH remote server
### First Stage: Build Environment
FROM ubuntu:22.04 as builder

### Set non-interactive installation to avoid prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

### Update package lists and install git, Node.js, and npm
RUN apt-get update && \
    apt-get install -y git nodejs npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

### Set working directory
WORKDIR /app

### Clone the repository to the working directory using the default branch
ARG REPO_URL=https://github.com/eclipse-oniro4openharmony/f-oh-data
RUN git clone ${REPO_URL} .
COPY allAppList.json /app/allAppList.json

### Install application dependencies
RUN npm install

### -------------------------------------------------------

### Second Stage: Production Environment
FROM ubuntu:22.04

### Set non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

### Install Node.js and npm
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

### Set working directory
WORKDIR /app

### Copy Node.js dependencies from the builder stage
COPY --from=builder /app/node_modules /app/node_modules
### Copy application code and other necessary files
COPY --from=builder /app /app

### Expose port 5000
EXPOSE 5000

### Start the application
CMD ["npm", "start"]