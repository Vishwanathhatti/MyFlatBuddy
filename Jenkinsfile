pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: some-value
spec:
  containers:
  - name: node
    image: node:18
    command: ['cat']
    tty: true

  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ['cat']
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['cat']
    tty: true
    securityContext:
      runAsUser: 0
    env:
      - name: KUBECONFIG
        value: /kube/config
    volumeMounts:
      - name: kubeconfig-secret
        mountPath: /kube/config
        subPath: kubeconfig

  - name: dind
    image: docker:dind
    args: ["--storage-driver=overlay2", "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"]
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""

  volumes:
    - name: kubeconfig-secret
      secret:
        secretName: kubeconfig-secret
'''
        }
    }

    environment {
        // Project Specific Config
        STUDENT_ID = "2401066"
        APP_NAME = "myFlatBuddy"
        REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        SONAR_TOKEN = "sqp_80d42557bd9f6ff2ebb31d7eb131812db60de049"
        
        // Construct Image URLs
        BACKEND_IMAGE = "${REGISTRY}/${STUDENT_ID}/flatbuddy-backend:latest"
        FRONTEND_IMAGE = "${REGISTRY}/${STUDENT_ID}/flatbuddy-frontend:latest"
    }

    stages {
        stage('Install + Build Frontend') {
            steps {
                container('node') {
                    dir('frontend') {
                        sh '''
                            npm install
                            npm run build
                        '''
                    }
                }
            }
        }

        stage('Install Backend') {
            steps {
                container('node') {
                    dir('backend') {
                        sh '''
                            npm install
                        '''
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.token=$SONAR_TOKEN \
                            -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000
                    '''
                }
            }
        }

        stage('Docker Hub Login') {
            // Optional: If you need external Docker Hub
            steps {
                container('dind') {
                    echo "Skipping Docker Hub login (using internal Nexus)"
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                container('dind') {
                    sh '''
                        sleep 5
                        # Build Backend
                        docker build -t $BACKEND_IMAGE ./backend

                        # Build Frontend
                        docker build -t $FRONTEND_IMAGE ./frontend
                    '''
                }
            }
        }

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        echo "Logging into Nexus"
                        echo "Changeme@2025" | docker login \
                          $REGISTRY \
                          -u admin --password-stdin
                    '''
                }
            }
        }

        stage('Push to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        docker push $BACKEND_IMAGE
                        docker push $FRONTEND_IMAGE
                    '''
                }
            }
        }

        stage('Create Namespace') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl get namespace $STUDENT_ID || kubectl create namespace $STUDENT_ID
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        # ------------------------------------------------------------------
                        # FIX: DYNAMICALLY FIND NEXUS IP
                        # The Node (kubelet) cannot resolve the internal DNS name.
                        # We must find the Cluster IP and use that for pulling images.
                        # ------------------------------------------------------------------
                        
                        echo "--- Resolving Nexus IP ---"
                        # Fetch the Cluster IP of the Nexus service in namespace 'nexus'
                        NEXUS_IP=$(kubectl get svc nexus-service-for-docker-hosted-registry -n nexus -o jsonpath='{.spec.clusterIP}')
                        echo "Nexus Cluster IP: $NEXUS_IP"
                        
                        # Use the IP for the Docker Registry URL
                        REGISTRY_IP="$NEXUS_IP:8085"
                        echo "Using Registry IP for Deployment: $REGISTRY_IP"

                        # ------------------------------------------------------------------
                        # STEP 1: Create Image Pull Secret using the IP
                        # We explicitly add http:// to hint Kubelet to use HTTP
                        # ------------------------------------------------------------------
                        kubectl create secret docker-registry nexus-secret \
                            --docker-server=http://$REGISTRY_IP \
                            --docker-username=admin \
                            --docker-password=Changeme@2025 \
                            -n $STUDENT_ID \
                            --dry-run=client -o yaml | kubectl apply -f -

                        # ------------------------------------------------------------------
                        # STEP 2: Update Manifests to use IP instead of DNS
                        # (We use sed to replace the DNS string with the IP in the YAMLs)
                        # ------------------------------------------------------------------
                        
                        # Replace DNS with IP in Backend Manifest
                        sed -i "s|$REGISTRY|$REGISTRY_IP|g" k8s/backend.yaml
                        
                        # Replace DNS with IP in Frontend Manifest
                        sed -i "s|$REGISTRY|$REGISTRY_IP|g" k8s/frontend.yaml
                        
                        echo "--- Applying Manifests ---"
                        cat k8s/backend.yaml | grep image:
                        cat k8s/frontend.yaml | grep image:
                        
                        kubectl apply -f k8s/backend.yaml -n $STUDENT_ID
                        kubectl apply -f k8s/frontend.yaml -n $STUDENT_ID
                        kubectl apply -f k8s/ingress.yaml -n $STUDENT_ID

                        kubectl get all -n $STUDENT_ID
                        kubectl get ingress -n $STUDENT_ID
                        kubectl get services -n $STUDENT_ID
                    '''
                }
            }
        }

        stage('Debug Information') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "--- Waiting for pods to stabilize (10s) ---"
                        sleep 10
                        
                        echo "--- Pod Status ---"
                        kubectl get pods -n $STUDENT_ID
                        
                        echo "--- Pod Events (Why is it failing?) ---"
                        kubectl get events -n $STUDENT_ID --sort-by='.lastTimestamp'
                        
                        echo "--- Detailed Pod Description ---"
                        # Describe all pods to see the Pulll Events
                        kubectl describe pods -n $STUDENT_ID
                    '''
                }
            }
        }
    }
}
