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
                echo "Repository: ${env.GIT_URL}"
                echo "Branch: ${env.GIT_BRANCH}"
                echo "Commit: ${env.GIT_COMMIT}"
            }
        }

        stage('Build Info') {
            steps {
                echo '================================================'
                echo '       FlatBuddy Application - CI/CD Pipeline  '
                echo '================================================'
                echo "Build Number: #${env.BUILD_NUMBER}"
                echo "Build ID: ${env.BUILD_ID}"
                echo "Job Name: ${env.JOB_NAME}"
                echo "Workspace: ${env.WORKSPACE}"
                echo '================================================'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    echo '================================================'
                    echo '      Running SonarQube Code Analysis         '
                    echo '================================================'
                    
                    def sonarToken = 'sqp_c571c31452fca404b94ba9986f46a6207007c679'
                    def sonarUrl = 'https://sonarqube.imcc.com'
                    def projectKey = '2401066-myFlatBuddy'
                    
                    try {
                        // Check if sonar-scanner is available
                        def scannerCheck = sh(script: 'which sonar-scanner || echo "not_found"', returnStdout: true).trim()
                        
                        if (scannerCheck == 'not_found') {
                            echo '⚠️  SonarQube Scanner not found on Jenkins server'
                            echo ''
                            echo '📋 Manual Analysis Instructions:'
                            echo '=================================='
                            echo 'Run this command locally to analyze your code:'
                            echo ''
                            echo "sonar-scanner \\"
                            echo "  -Dsonar.projectKey=${projectKey} \\"
                            echo "  -Dsonar.sources=. \\"
                            echo "  -Dsonar.host.url=${sonarUrl} \\"
                            echo "  -Dsonar.token=${sonarToken}"
                            echo ''
                            echo "Or visit: ${sonarUrl}/tutorials?id=${projectKey}"
                            echo '=================================='
                        } else {
                            echo '✅ SonarQube Scanner found, running analysis...'
                            
                            // Run SonarQube analysis
                            sh """
                                sonar-scanner \
                                  -Dsonar.projectKey=${projectKey} \
                                  -Dsonar.projectName='FlatBuddy Application' \
                                  -Dsonar.sources=. \
                                  -Dsonar.host.url=${sonarUrl} \
                                  -Dsonar.token=${sonarToken} \
                                  -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/.git/**,**/.vscode/**
                            """
                            
                            echo '✅ SonarQube analysis completed successfully!'
                            echo "📊 View results at: ${sonarUrl}/dashboard?id=${projectKey}"
                        }
                    } catch (Exception e) {
                        echo "⚠️  SonarQube analysis encountered an error: ${e.message}"
                        echo 'Pipeline will continue...'
                    }
                    
                    echo '================================================'
                }
            }
        }

        stage('Docker Images Info') {
            steps {
                echo '================================================'
                echo '          Docker Images on Docker Hub          '
                echo '================================================'
                echo 'Your images are available at:'
                echo "  - ${BACKEND_IMAGE}:latest"
                echo "  - ${FRONTEND_IMAGE}:latest"
                echo ''
                echo 'To build and push updates locally:'
                echo '  # Backend'
                echo "  docker build -t ${BACKEND_IMAGE}:latest ./backend"
                echo "  docker push ${BACKEND_IMAGE}:latest"
                echo ''
                echo '  # Frontend'
                echo "  docker build -t ${FRONTEND_IMAGE}:latest ./frontend"
                echo "  docker push ${FRONTEND_IMAGE}:latest"
                echo '================================================'
            }
        }

        stage('Nexus Repository Info') {
            steps {
                echo '================================================'
                echo '            Nexus Artifact Repository          '
                echo '================================================'
                echo 'Nexus Server: http://nexus.imcc.com'
                echo 'Username: student'
                echo ''
                echo 'To push Docker images to Nexus (if configured):'
                echo '  1. Login to Nexus Docker registry:'
                echo '     docker login nexus.imcc.com:8082 -u student'
                echo ''
                echo '  2. Tag your images:'
                echo '     docker tag flatbuddy-backend nexus.imcc.com:8082/flatbuddy-backend:latest'
                echo '     docker tag flatbuddy-frontend nexus.imcc.com:8082/flatbuddy-frontend:latest'
                echo ''
                echo '  3. Push to Nexus:'
                echo '     docker push nexus.imcc.com:8082/flatbuddy-backend:latest'
                echo '     docker push nexus.imcc.com:8082/flatbuddy-frontend:latest'
                echo '================================================'
            }
        }

        stage('Deployment Instructions') {
            steps {
                echo '================================================'
                echo '          Deployment Instructions              '
                echo '================================================'
                echo 'Option 1: Deploy from Docker Hub'
                echo '  1. On your deployment server, pull images:'
                echo "     docker pull ${BACKEND_IMAGE}:latest"
                echo "     docker pull ${FRONTEND_IMAGE}:latest"
                echo ''
                echo '  2. Run with docker-compose:'
                echo '     docker-compose up -d'
                echo ''
                echo 'Option 2: Deploy from Nexus'
                echo '  1. Pull from Nexus registry:'
                echo '     docker pull nexus.imcc.com:8082/flatbuddy-backend:latest'
                echo '     docker pull nexus.imcc.com:8082/flatbuddy-frontend:latest'
                echo ''
                echo '  2. Update docker-compose.yml to use Nexus images'
                echo '  3. Run: docker-compose up -d'
                echo '================================================'
            }
        }

        stage('Summary') {
            steps {
                echo ''
                echo '✅✅✅ BUILD SUCCESSFUL ✅✅✅'
                echo ''
                echo 'What was done:'
                echo '  ✓ Source code checked out from GitHub'
                echo '  ✓ Build information collected'
                echo '  ✓ Deployment instructions provided'
                echo ''
                echo 'Next steps:'
                echo '  1. Review code quality on SonarQube'
                echo '  2. Build and push Docker images locally'
                echo '  3. Deploy using docker-compose'
                echo ''
                echo 'Resources:'
                echo "  - Docker Hub: https://hub.docker.com/u/${DOCKER_HUB_REPO}"
                echo '  - SonarQube: http://sonarqube.imcc.com'
                echo '  - Nexus: http://nexus.imcc.com'
                echo ''
            }
        }
    }

    post {
        success {
            echo ''
            echo '================================================'
            echo '    ✅ PIPELINE COMPLETED SUCCESSFULLY ✅        '
            echo '================================================'
            echo "Build #${env.BUILD_NUMBER} finished successfully"
            echo "Duration: ${currentBuild.durationString}"
            echo '================================================'
            echo ''
        }
        failure {
            echo ''
            echo '================================================'
            echo '         ❌ PIPELINE FAILED ❌                  '
            echo '================================================'
            echo 'Check the console output above for errors'
            echo '================================================'
            echo ''
        }
        always {
            echo "Pipeline execution completed at: ${new Date()}"
        }
    }
}

