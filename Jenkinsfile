pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'vishwanath30'
        BACKEND_IMAGE = "${DOCKER_HUB_REPO}/flatbuddy-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_REPO}/flatbuddy-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo '✅ Code checked out successfully from GitHub'
            }
        }

        stage('Build Info') {
            steps {
                echo '================================================'
                echo 'FlatBuddy Application - CI/CD Pipeline'
                echo '================================================'
                echo "Build Number: ${env.BUILD_NUMBER}"
                echo "Branch: ${env.GIT_BRANCH}"
                echo "Docker Hub Repository: ${DOCKER_HUB_REPO}"
                echo '================================================'
            }
        }

        stage('Install Dependencies - Backend') {
            steps {
                dir('backend') {
                    script {
                        echo 'Installing backend dependencies...'
                        sh 'npm install'
                        echo '✅ Backend dependencies installed'
                    }
                }
            }
        }

        stage('Install Dependencies - Frontend') {
            steps {
                dir('frontend') {
                    script {
                        echo 'Installing frontend dependencies...'
                        sh 'npm install'
                        echo '✅ Frontend dependencies installed'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    echo 'Running SonarQube code quality analysis...'
                    try {
                        withSonarQubeEnv('SonarQube') {
                            // Backend analysis
                            sh """
                                sonar-scanner \
                                  -Dsonar.projectKey=flatbuddy-backend \
                                  -Dsonar.projectName='FlatBuddy Backend' \
                                  -Dsonar.sources=./backend \
                                  -Dsonar.host.url=http://sonarqube.imcc.com \
                                  -Dsonar.exclusions=**/node_modules/**
                            """
                            
                            // Frontend analysis
                            sh """
                                sonar-scanner \
                                  -Dsonar.projectKey=flatbuddy-frontend \
                                  -Dsonar.projectName='FlatBuddy Frontend' \
                                  -Dsonar.sources=./frontend/src \
                                  -Dsonar.host.url=http://sonarqube.imcc.com \
                                  -Dsonar.exclusions=**/node_modules/**,**/dist/**
                            """
                            
                            echo '✅ SonarQube analysis completed'
                        }
                    } catch (Exception e) {
                        echo "⚠️ SonarQube analysis failed: ${e.message}"
                        echo 'Continuing pipeline despite SonarQube failure...'
                    }
                }
            }
        }

        stage('Docker Images Status') {
            steps {
                echo '================================================'
                echo 'Docker Images Information'
                echo '================================================'
                echo 'NOTE: Docker is not available on this Jenkins server.'
                echo 'Docker images should be built and pushed manually from your local machine.'
                echo ''
                echo 'To build and push images locally, run:'
                echo "  docker build -t ${BACKEND_IMAGE}:latest ./backend"
                echo "  docker build -t ${FRONTEND_IMAGE}:latest ./frontend"
                echo "  docker push ${BACKEND_IMAGE}:latest"
                echo "  docker push ${FRONTEND_IMAGE}:latest"
                echo ''
                echo 'Available images on Docker Hub:'
                echo "  - ${BACKEND_IMAGE}:latest"
                echo "  - ${FRONTEND_IMAGE}:latest"
                echo '================================================'
            }
        }

        stage('Deployment Instructions') {
            steps {
                echo '================================================'
                echo 'Deployment Instructions'
                echo '================================================'
                echo 'To deploy the application on a server with Docker:'
                echo ''
                echo '1. Pull the images:'
                echo "   docker pull ${BACKEND_IMAGE}:latest"
                echo "   docker pull ${FRONTEND_IMAGE}:latest"
                echo ''
                echo '2. Run using docker-compose:'
                echo '   docker-compose up -d'
                echo ''
                echo 'Or deploy to your target environment using these images.'
                echo '================================================'
            }
        }
    }

    post {
        success {
            echo ''
            echo '✅✅✅ Pipeline completed successfully! ✅✅✅'
            echo ''
            echo 'Summary:'
            echo "  - Code checked out from: ${env.GIT_BRANCH}"
            echo '  - Dependencies installed for backend and frontend'
            echo '  - SonarQube analysis attempted'
            echo "  - Docker images available: ${BACKEND_IMAGE}:latest, ${FRONTEND_IMAGE}:latest"
            echo ''
        }
        failure {
            echo ''
            echo '❌ Pipeline failed! Check the logs above for details.'
            echo ''
        }
        always {
            echo 'Pipeline execution completed.'
        }
    }
}
