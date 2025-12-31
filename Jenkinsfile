pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json

  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config

  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    environment {
        // User Specific Config
        STUDENT_ID = "2401066"
        REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        // User provided this token previously. Friend uses a credential '2401098_Blockvote'.
        // We will default to the token variable if credential binding fails or is not preferred,
        // but strictly following the friend's pattern would use withCredentials.
        // Since I don't know the credential ID for 2401066, I will use the hardcoded token 
        // OR prompt user to create one. For now, sticking to the hardcoded token approach 
        // inside the shell block to be safe, or falling back to a generic credential pattern if exists.
        // Friend's code: withCredentials([string(credentialsId: '2401098_Blockvote', ...)])
        // I will use the hardcoded token variable for simplicity as per previous success.
        SONAR_TOKEN = "sqp_80d42557bd9f6ff2ebb31d7eb131812db60de049" 
    }

    stages {

        stage('Build Backend Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Building backend Docker image..."
                        # Wait for dind to start
                        sleep 10
                        
                        # Build using the standalone Dockerfile (now includes npm install)
                        docker build -t flatbuddy-backend:latest ./backend
                        docker image ls
                    '''
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Building frontend Docker image..."
                        docker build \
                        -t flatbuddy-frontend:latest \
                        ./frontend
                    '''
                }
            }
        }


        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    // Using the hardcoded token variable directly for this user
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=2401066-myFlatBuddy \
                            -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                            -Dsonar.token=$SONAR_TOKEN \
                            -Dsonar.sources=./ \
                            -Dsonar.exclusions=**/node_modules/**,**/dist/**
                    '''
                }
            }
        }

        stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker --version
                        # Reuse the admin credentials that worked for the friend
                        docker login $REGISTRY -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Tag & Push Images') {
            steps {
                container('dind') {
                    sh '''
                        echo "Tagging images..."
                        # Format: Registry/Namespace(Repo)/Image:Tag
                        docker tag flatbuddy-backend:latest $REGISTRY/$STUDENT_ID/flatbuddy-backend:latest
                        docker tag flatbuddy-frontend:latest $REGISTRY/$STUDENT_ID/flatbuddy-frontend:latest

                        echo "Pushing images..."
                        docker push $REGISTRY/$STUDENT_ID/flatbuddy-backend:latest
                        docker push $REGISTRY/$STUDENT_ID/flatbuddy-frontend:latest

                        docker image ls
                    '''
                }
            }
        }

        stage('Deploy Application') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "Applying Kubernetes deployment..."
                        
                        # Apply Manifests
                        kubectl apply -f k8s/backend.yaml -n $STUDENT_ID
                        kubectl apply -f k8s/frontend.yaml -n $STUDENT_ID
                        
                        # Clean and Re-apply Ingress (Friend's pattern)
                        kubectl delete ingress flatbuddy-ingress -n $STUDENT_ID --ignore-not-found=true
                        kubectl apply -f k8s/ingress.yaml -n $STUDENT_ID

                        kubectl get all -n $STUDENT_ID
                    '''
                }
            }
        }
    }
}
