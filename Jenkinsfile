pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    args:
    - "--storage-driver=overlay2"
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  - name: jnlp
    image: jenkins/inbound-agent:3309.v27b_9314fd1a_4-1
    env:
    - name: JENKINS_AGENT_WORKDIR
      value: "/home/jenkins/agent"
    volumeMounts:
    - mountPath: "/home/jenkins/agent"
      name: workspace-volume

  volumes:
  - name: workspace-volume
    emptyDir: {}
"""
        }
    }

    environment {
        SONAR_TOKEN = 'sqp_c571c31452fca404b94ba9986f46a6207007c679'
        SONAR_URL = 'http://sonarqube.imcc.com'
        SONAR_PROJECT_KEY = '2401066-myFlatBuddy'
        NEXUS_RAW = 'https://nexus.imcc.com/repository/2401066'
        NEXUS_USER = 'student'
        NEXUS_PASS = 'Imcc@2025'
        DOCKER_HUB_REPO = 'vishwanath30'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '================================================'
                echo '   ✅ Checking out code from GitHub           '
                echo '================================================'
                checkout scm
                echo "Repository: ${env.GIT_URL}"
                echo "Branch: ${env.GIT_BRANCH}"
                echo "Commit: ${env.GIT_COMMIT}"
            }
        }

        stage('Build Info') {
            steps {
                echo '================================================'
                echo '   FlatBuddy Application - CI/CD Pipeline     '
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
                container('sonar-scanner') {
                    echo '================================================'
                    echo '   🔍 Running SonarQube Code Analysis         '
                    echo '================================================'
                    sh """
                        sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.projectName='FlatBuddy Application' \
                          -Dsonar.sources=backend \
                          -Dsonar.host.url=${SONAR_URL} \
                          -Dsonar.token=${SONAR_TOKEN} \
                          -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/.git/**,frontend/**
                    """
                    echo '✅ SonarQube analysis completed!'
                    echo "📊 View results at: ${SONAR_URL}/dashboard?id=${SONAR_PROJECT_KEY}"
                    echo '================================================'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                container('dind') {
                    echo '================================================'
                    echo '   🐳 Building Docker Images                  '
                    echo '================================================'
                    sh """
                        docker build -t ${DOCKER_HUB_REPO}/flatbuddy-backend:latest ./backend
                        docker build -t ${DOCKER_HUB_REPO}/flatbuddy-frontend:latest ./frontend
                    """
                    echo '✅ Docker images built successfully!'
                    echo '================================================'
                }
            }
        }

        stage('Export Docker Images') {
            steps {
                container('dind') {
                    echo '================================================'
                    echo '   📦 Exporting Docker Images as TAR files    '
                    echo '================================================'
                    sh """
                        docker save -o flatbuddy-backend.tar ${DOCKER_HUB_REPO}/flatbuddy-backend:latest
                        docker save -o flatbuddy-frontend.tar ${DOCKER_HUB_REPO}/flatbuddy-frontend:latest
                    """
                    echo '✅ Images exported successfully!'
                    echo '================================================'
                }
            }
        }

        stage('Upload to Nexus') {
            steps {
                echo '================================================'
                echo '   📤 Uploading to Nexus Repository            '
                echo '================================================'
                sh """
                    curl -k -u ${NEXUS_USER}:${NEXUS_PASS} --upload-file flatbuddy-backend.tar ${NEXUS_RAW}/flatbuddy-backend.tar
                    curl -k -u ${NEXUS_USER}:${NEXUS_PASS} --upload-file flatbuddy-frontend.tar ${NEXUS_RAW}/flatbuddy-frontend.tar
                """
                echo '✅ Upload to Nexus completed!'
                echo "🔗 View at: ${NEXUS_RAW}/"
                echo '================================================'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                container('dind') {
                    echo '================================================'
                    echo '   🚀 Pushing Images to Docker Hub            '
                    echo '================================================'
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                            docker push ${DOCKER_HUB_REPO}/flatbuddy-backend:latest
                            docker push ${DOCKER_HUB_REPO}/flatbuddy-frontend:latest
                            docker logout
                        """
                    }
                    echo '✅ Images pushed to Docker Hub!'
                    echo "🔗 View at: https://hub.docker.com/u/${DOCKER_HUB_REPO}"
                    echo '================================================'
                }
            }
        }

        stage('Deploy Application') {
            steps {
                container('dind') {
                    echo '================================================'
                    echo '   🚀 Deploying Application                   '
                    echo '================================================'
                    sh """
                        # Load images
                        docker load -i flatbuddy-backend.tar
                        docker load -i flatbuddy-frontend.tar
                        
                        # Stop and remove old containers
                        docker stop flatbuddy-backend || true
                        docker rm flatbuddy-backend || true
                        docker stop flatbuddy-frontend || true
                        docker rm flatbuddy-frontend || true
                        
                        # Run new containers
                        docker run -d --name flatbuddy-backend -p 5000:5000 ${DOCKER_HUB_REPO}/flatbuddy-backend:latest
                        docker run -d --name flatbuddy-frontend -p 3000:3000 ${DOCKER_HUB_REPO}/flatbuddy-frontend:latest
                    """
                    echo '✅ Application deployed successfully!'
                    echo '🌐 Backend: http://localhost:5000'
                    echo '🌐 Frontend: http://localhost:3000'
                    echo '================================================'
                }
            }
        }
    }

    post {
        success {
            echo ''
            echo '================================================'
            echo '   ✅✅✅ PIPELINE COMPLETED SUCCESSFULLY ✅✅✅  '
            echo '================================================'
            echo "Build #${env.BUILD_NUMBER} finished successfully"
            echo "Duration: ${currentBuild.durationString}"
            echo ''
            echo 'Summary:'
            echo "  ✓ Code checked out from: ${env.GIT_BRANCH}"
            echo "  ✓ SonarQube analysis: ${SONAR_URL}/dashboard?id=${SONAR_PROJECT_KEY}"
            echo "  ✓ Docker images built and exported"
            echo "  ✓ Nexus artifacts: ${NEXUS_RAW}/"
            echo "  ✓ Docker Hub: https://hub.docker.com/u/${DOCKER_HUB_REPO}"
            echo "  ✓ Application deployed and running"
            echo '================================================'
            echo ''
        }
        failure {
            echo ''
            echo '================================================'
            echo '   ❌ PIPELINE FAILED ❌                        '
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

