# Updated Deployment Internal Flow

This document explains the internal flow of your updated Jenkins pipeline, which now runs entirely within **Kubernetes**.

## Overview of the Pipeline

Your pipeline is executed inside a **Kubernetes Pod** managed by Jenkins. This pod is ephemeral (created for the build and destroyed after).

It uses a `podTemplate` that spins up a pod with multiple containers to handle specific tasks:
1.  **`node`**: To install dependencies and build your frontend/backend code.
2.  **`sonar-scanner`**: To run the code quality analysis.
3.  **`dind` (Docker-in-Docker)**: To build and push Docker images.
4.  **`kubectl`**: To deploy the final application to the Kubernetes cluster.

---

## Step-by-Step Flow

### 1. Environment Setup
The pipeline initializes with the following configuration:
-   **Namespace:** `2401066`
-   **Registry:** `nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085`
-   **SonarQube URL:** `http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000`
-   **Sonar Token:** Your provided secure token.

### 2. Stage: Install & Build
**Container used:** `node`
-   **Frontend:** Runs `npm install` and `npm run build` to create the production build (dist/build folder).
-   **Backend:** Runs `npm install` to ensure backend dependencies are ready.

### 3. Stage: SonarQube Analysis
**Container used:** `sonar-scanner`
-   The scanner checks your code against the SonarQube server.
-   It uses the `sonar-project.properties` file (which we created) to know what to scan.
-   Authentication is handled via the `SONAR_TOKEN`.

### 4. Stage: Docker Build
**Container used:** `dind`
-   The pipeline builds two Docker images using the artifacts from the previous steps:
    -   `flatbuddy-backend:latest`
    -   `flatbuddy-frontend:latest`
-   These images are tagged with the internal registry URL: `<Registry-URL>/2401066/<image-name>`.

### 5. Stage: Push to Nexus
**Container used:** `dind`
-   **Login:** It logs into the internal Nexus registry using the `dind` container.
-   **Push:** It pushes the built images to the Nexus repository, making them available for the Kubernetes cluster to pull.

### 6. Stage: Deploy to Kubernetes
**Container used:** `kubectl`
-   **Namespace Check:** Ensures the namespace `2401066` exists.
-   **Secret Creation:** Creates a `docker-registry` secret named `nexus-secret` in your namespace. This allows Kubernetes to authenticate with Nexus to pull your private images.
-   **Apply Manifests:**
    -   Applies `k8s/backend.yaml`: Deploys the backend API.
    -   Applies `k8s/frontend.yaml`: Deploys the frontend UI.
-   **Verification:** Lists the running pods and services to confirm the deployment was successful.

---

## Key Changes from Previous Setup
-   **No "infra-compose.yml":** We are using the existing cluster infrastructure (Nexus, SonarQube) provided by your college/friend's setup, rather than spinning up our own local versions.
-   **Kubernetes-Native:** Deploying directly to K8s instead of `docker-compose`.
-   **Internal Networking:** Using internal `.svc.cluster.local` DNS names for communication between Jenkins, SonarQube, and Nexus, which is faster and more secure.
