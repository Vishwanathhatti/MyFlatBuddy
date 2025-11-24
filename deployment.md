# Beginner's Deployment Guide: FlatBuddy on College Server

This guide is designed for complete beginners. We will set up a professional "CI/CD Pipeline" (Continuous Integration/Continuous Deployment) on your college server.

**The Goal:** When you push code to GitHub, your server will automatically:
1.  Check the code quality (SonarQube).
2.  Build the application (Docker).
3.  Save the build (Nexus).
4.  Run the application (Docker Compose).

---

## Phase 1: Prepare Your Code (On Your Laptop)

Before touching the server, we need to prepare your project files.

### 1. Create `infra-compose.yml`
Create a new file named `infra-compose.yml` in your project folder. This file tells Docker how to run Jenkins, SonarQube, and Nexus.

```yaml
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    user: root # Needed to access Docker socket

  sonarqube:
    image: sonarqube:lts
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true

  nexus:
    image: sonatype/nexus3
    ports:
      - "8081:8081"
      - "5000:5000"
    volumes:
      - nexus-data:/nexus-data
```

### 2. Update `docker-compose.yml`
Update your existing `docker-compose.yml` to work in production. We will use environment variables for the database connection so we don't hardcode secrets.

```yaml
version: '3.8'
services:
  backend:
    image: localhost:5000/flatbuddy-backend:latest
    ports:
      - "3001:3001"
    environment:
      - MONGO_URI=${MONGO_URI} # Read from server environment
      - PORT=3001
    restart: always

  frontend:
    image: localhost:5000/flatbuddy-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
```

### 3. Create `Jenkinsfile`
Create a file named `Jenkinsfile` (no extension) in your project folder. This is the script Jenkins will run.

```groovy
pipeline {
    agent any
    
    environment {
        NEXUS_URL = "localhost:5000"
        IMAGE_TAG = "latest"
        // You will configure this secret in Jenkins later
        MONGO_URI = credentials('mongo-atlas-uri') 
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Pulls code from your GitHub
                checkout scm
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    sh "docker build -t ${NEXUS_URL}/flatbuddy-backend:${IMAGE_TAG} ./backend"
                    sh "docker build -t ${NEXUS_URL}/flatbuddy-frontend:${IMAGE_TAG} ./frontend"
                }
            }
        }
        
        stage('Push to Nexus') {
            steps {
                script {
                    // Push images to our local Nexus registry
                    sh "docker push ${NEXUS_URL}/flatbuddy-backend:${IMAGE_TAG}"
                    sh "docker push ${NEXUS_URL}/flatbuddy-frontend:${IMAGE_TAG}"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                // Stop old containers and start new ones
                sh "docker-compose down"
                // Pass the Mongo URI to the containers
                sh "MONGO_URI='${MONGO_URI}' docker-compose up -d"
            }
        }
    }
}
```

### 4. Push to GitHub
Commit these 3 new files (`infra-compose.yml`, `docker-compose.yml`, `Jenkinsfile`) and push them to your GitHub repository.

---

## Phase 2: Server Setup (On College Server)

Log in to your college server terminal.

### 1. Install Docker
Ask your server admin to install **Docker** and **Docker Compose** if they aren't already there.

### 2. Start Infrastructure
Copy your `infra-compose.yml` file to the server (or create it there). Run:
```bash
docker-compose -f infra-compose.yml up -d
```
Wait a few minutes. This starts Jenkins (port 8080), SonarQube (port 9000), and Nexus (port 8081).

---

## Phase 3: Configure Tools

### 1. Configure Nexus (The Artifact Store)
1.  Open `http://<server-ip>:8081` in your browser.
2.  Click "Sign in". Default user: `admin`.
    *   **Password:** You need to find it inside the container. Run on server:
        `docker exec -it <nexus-container-id> cat /nexus-data/admin.password`
3.  Follow the setup wizard.
4.  **Create Docker Registry:**
    *   Go to **Settings (Gear Icon) -> Repositories -> Create repository**.
    *   Select **docker (hosted)**.
    *   Name: `docker-hosted`.
    *   **HTTP Port:** Enter `5000`. (Crucial!)
    *   Click "Create repository".

### 2. Configure SonarQube (The Code Checker)
1.  Open `http://<server-ip>:9000`.
2.  Login with `admin` / `admin`. Change password.
3.  **Create Token:**
    *   User Icon -> My Account -> Security.
    *   Generate token name: `jenkins-token`. **Copy this!**
4.  **Create Project:**
    *   "Create a local project".
    *   Display Name: `FlatBuddy`. Key: `FlatBuddy`.
    *   "Use the global setting" for the baseline.

### 3. Configure Jenkins (The Automation Server)
1.  Open `http://<server-ip>:8080`.
2.  **Unlock Jenkins:**
    *   Run on server: `docker exec -it <jenkins-container-id> cat /var/jenkins_home/secrets/initialAdminPassword`
    *   Paste the password.
3.  **Install Plugins:** Select "Install suggested plugins".
4.  **Create Admin User:** Fill in your details.
5.  **Install Extra Plugins:**
    *   Manage Jenkins -> Plugins -> Available Plugins.
    *   Search and install: **Docker**, **Docker Pipeline**, **SonarQube Scanner**.
    *   Restart Jenkins.

### 4. Connect Jenkins to Tools
1.  **Connect SonarQube:**
    *   Manage Jenkins -> System -> "SonarQube servers".
    *   Name: `SonarQube`.
    *   Server URL: `http://sonarqube:9000` (Use container name).
    *   Authentication Token: Add the `jenkins-token` you copied earlier.
2.  **Configure Sonar Scanner:**
    *   Manage Jenkins -> Tools -> "SonarQube Scanner".
    *   Name: `SonarScanner`.
    *   Check "Install automatically".
3.  **Add MongoDB Secret:**
    *   Manage Jenkins -> Credentials -> System -> Global credentials -> Add Credentials.
    *   Kind: **Secret text**.
    *   Secret: Paste your **MongoDB Atlas Connection String**.
    *   ID: `mongo-atlas-uri`.

---

## Phase 4: Run the Pipeline

1.  **Create Job:**
    *   Dashboard -> New Item.
    *   Name: `FlatBuddy-Deploy`.
    *   Select **Pipeline**. Click OK.
2.  **Configure Job:**
    *   Scroll to "Pipeline" section.
    *   Definition: **Pipeline script from SCM**.
    *   SCM: **Git**.
    *   Repository URL: Paste your **GitHub Repository URL**.
    *   Branch Specifier: `*/main` (or `*/master`).
3.  **Run:**
    *   Click **Save**.
    *   Click **Build Now**.

**What happens next?**
You will see a stage view. Jenkins will pull your code, check it with SonarQube, build the Docker images, push them to Nexus, and finally run your app.

**Access your App:**
*   Frontend: `http://<server-ip>:80`
*   Backend: `http://<server-ip>:3001`
