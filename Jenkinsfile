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

    stages {

        stage('Build Backend Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Building backend Docker image..."
                        sleep 10
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
                    // Using direct token since we might not have the credential ID set up
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=2401066-myFlatBuddy \
                            -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                            -Dsonar.login=sqp_80d42557bd9f6ff2ebb31d7eb131812db60de049 \
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
                        sleep 10
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Tag & Push Images') {
            steps {
                container('dind') {
                    sh '''
                        echo "Tagging images..."
                        docker tag flatbuddy-backend:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/vishwanath/flatbuddy-backend:latest
                        docker tag flatbuddy-frontend:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/vishwanath/flatbuddy-frontend:latest

                        echo "Pushing images..."
                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/vishwanath/flatbuddy-backend:latest
                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/vishwanath/flatbuddy-frontend:latest

                        docker image ls
                    '''
                }
            }
        }

        stage('Deploy FlatBuddy Application') {
            steps {
                container('kubectl') {
                    script {
                        // Dir block not strictly needed if paths are correct, but following pattern
                        sh '''
                            echo "Applying FlatBuddy Kubernetes deployment..."
                            kubectl apply -f k8s/backend.yaml 
                            kubectl apply -f k8s/frontend.yaml 
                            
                            echo "Refreshing Ingress (Cleaning old config)..."
                            kubectl delete ingress flatbuddy-ingress -n 2401066 --ignore-not-found=true
                            kubectl apply -f k8s/ingress.yaml
                            
                        '''
                    }
                }
            }
        }
    }
}
