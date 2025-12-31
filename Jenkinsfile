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
        REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository"
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
                        # REVERTED TO DNS STRATEGY
                        # The IP strategy failed because of HTTPS enforcement.
                        # We must use the domain name which is likely whitelisted as insecure.
                        # ------------------------------------------------------------------
                        
                        # Create secret for pulling images from Nexus
                        kubectl create secret docker-registry nexus-secret \
                            --docker-server=$REGISTRY \
                            --docker-username=admin \
                            --docker-password=Changeme@2025 \
                            -n $STUDENT_ID \
                            --dry-run=client -o yaml | kubectl apply -f -

                        # Apply Manifests
                        # We assume the YAML files already contain the correct DNS name
                        # (nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085)
                        
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
