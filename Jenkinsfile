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
                    echo '   🔍 Running Automated SonarQube Analysis    '
                    echo '================================================'
                    
                    def sonarToken = 'sqp_c571c31452fca404b94ba9986f46a6207007c679'
                    def sonarUrl = 'http://sonarqube.imcc.com'
                    def projectKey = '2401066-myFlatBuddy'
                    
                    try {
                        echo '📦 Running SonarQube scanner via Docker...'
                        
                        // Run SonarQube analysis using Docker container
                        sh """
                            docker run --rm \
                              -v \${WORKSPACE}:/usr/src \
                              sonarsource/sonar-scanner-cli \
                              -Dsonar.projectKey=${projectKey} \
                              -Dsonar.projectName='FlatBuddy Application' \
                              -Dsonar.sources=backend \
                              -Dsonar.host.url=${sonarUrl} \
                              -Dsonar.token=${sonarToken} \
                              -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/.git/**,**/.vscode/**,frontend/**
                        """
                        
                        echo '✅ SonarQube analysis completed successfully!'
                        echo "📊 View results at: ${sonarUrl}/dashboard?id=${projectKey}"
                    } catch (Exception e) {
                        echo "⚠️  SonarQube analysis failed: ${e.message}"
                        echo 'Pipeline will continue...'
                    }
                    
                    echo '================================================'
                }
            }
        }

        stage('Upload to Nexus') {
            steps {
                script {
                    echo '================================================'
                    echo '   📤 Uploading Artifacts to Nexus            '
                    echo '================================================'
                    
                    def nexusUrl = 'https://nexus.imcc.com/repository/2401066'
                    def nexusUser = 'student'
                    def nexusPass = 'Imcc@2025'
                    def timestamp = new Date().format('yyyyMMdd-HHmmss')
                    
                    try {
                        echo '📦 Creating project archive (excluding node_modules)...'
                        
                        // Create temporary directory and copy files
                        sh '''
                            mkdir -p temp_upload/backend temp_upload/frontend
                            
                            # Copy backend files (excluding node_modules)
                            rsync -av --exclude='node_modules' backend/ temp_upload/backend/ || \
                            find backend -type f ! -path '*/node_modules/*' -exec cp --parents {} temp_upload/ \\;
                            
                            # Copy frontend files (excluding node_modules)
                            rsync -av --exclude='node_modules' frontend/ temp_upload/frontend/ || \
                            find frontend -type f ! -path '*/node_modules/*' -exec cp --parents {} temp_upload/ \\;
                            
                            # Copy root files
                            cp docker-compose.yml Jenkinsfile temp_upload/ 2>/dev/null || true
                            
                            # Create zip archive
                            cd temp_upload
                            zip -r ../flatbuddy-source.zip . -x '*/node_modules/*' -x '*/.git/*'
                            cd ..
                        '''
                        
                        echo '✅ Archive created successfully'
                        echo "📤 Uploading to Nexus..."
                        
                        // Upload to Nexus
                        sh """
                            curl -k -u ${nexusUser}:${nexusPass} \
                              --upload-file flatbuddy-source.zip \
                              ${nexusUrl}/flatbuddy-source-${timestamp}.zip
                        """
                        
                        echo '✅ Upload to Nexus completed successfully!'
                        echo "📦 Artifact: flatbuddy-source-${timestamp}.zip"
                        echo "🔗 View at: ${nexusUrl}/"
                        
                    } catch (Exception e) {
                        echo "⚠️  Nexus upload failed: ${e.message}"
                        echo 'Pipeline will continue...'
                    } finally {
                        // Cleanup
                        sh 'rm -rf temp_upload flatbuddy-source.zip 2>/dev/null || true'
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

