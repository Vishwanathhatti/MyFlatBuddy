pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'vishwanath30'
        BACKEND_IMAGE = "${DOCKER_HUB_REPO}/flatbuddy-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_REPO}/flatbuddy-frontend"
        BUILD_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checked out successfully'
            }
        }

        stage('Verify Docker') {
            steps {
                script {
                    echo 'Checking Docker availability...'
                    sh 'docker --version'
                    sh 'docker info'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Building Backend Docker image...'
                    sh "docker build -t ${BACKEND_IMAGE}:${BUILD_TAG} -t ${BACKEND_IMAGE}:latest ./backend"
                    
                    echo 'Building Frontend Docker image...'
                    sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_TAG} -t ${FRONTEND_IMAGE}:latest ./frontend"
                    
                    echo 'Docker images built successfully'
                    sh 'docker images | grep flatbuddy'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo 'Logging into Docker Hub...'
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        
                        echo 'Pushing Backend image...'
                        sh "docker push ${BACKEND_IMAGE}:${BUILD_TAG}"
                        sh "docker push ${BACKEND_IMAGE}:latest"
                        
                        echo 'Pushing Frontend image...'
                        sh "docker push ${FRONTEND_IMAGE}:${BUILD_TAG}"
                        sh "docker push ${FRONTEND_IMAGE}:latest"
                        
                        echo 'All images pushed successfully'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    echo 'Running SonarQube analysis...'
                    try {
                        withSonarQubeEnv('SonarQube') {
                            // Backend analysis
                            sh """
                                sonar-scanner \
                                  -Dsonar.projectKey=flatbuddy-backend \
                                  -Dsonar.sources=./backend \
                                  -Dsonar.host.url=http://sonarqube.imcc.com \
                                  -Dsonar.exclusions=**/node_modules/**
                            """
                            // Frontend analysis
                            sh """
                                sonar-scanner \
                                  -Dsonar.projectKey=flatbuddy-frontend \
                                  -Dsonar.sources=./frontend/src \
                                  -Dsonar.host.url=http://sonarqube.imcc.com \
                                  -Dsonar.exclusions=**/node_modules/**,**/dist/**
                            """
                        }
                    } catch (Exception e) {
                        echo "SonarQube analysis failed: ${e.message}"
                        echo 'Continuing pipeline despite SonarQube failure...'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment stage - Images are now available on Docker Hub'
                echo "Backend: ${BACKEND_IMAGE}:${BUILD_TAG}"
                echo "Frontend: ${FRONTEND_IMAGE}:${BUILD_TAG}"
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo "Images pushed to Docker Hub:"
            echo "  - ${BACKEND_IMAGE}:${BUILD_TAG}"
            echo "  - ${FRONTEND_IMAGE}:${BUILD_TAG}"
        }
        failure {
            echo '❌ Pipeline failed! Check the logs above for details.'
        }
        always {
            script {
                try {
                    sh 'docker logout'
                } catch (Exception e) {
                    echo 'Docker logout failed or not needed'
                }
            }
        }
    }
}
