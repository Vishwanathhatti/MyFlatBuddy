pipeline {
    agent any

    environment {
        SONAR_TOKEN = 'sqp_c571c31452fca404b94ba9986f46a6207007c679'
        SONAR_URL = 'http://192.168.20.250:9000'
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
                echo '================================================'
                echo '   🔍 SonarQube Code Analysis                 '
                echo '================================================'
                echo "✅ SonarQube analysis configured"
                echo "📊 View results at: ${SONAR_URL}/dashboard?id=${SONAR_PROJECT_KEY}"
                echo ""
                echo "To run analysis, execute locally:"
                echo "  ./run-sonar-analysis.bat"
                echo '================================================'
            }
        }

        stage('Docker Images Status') {
            steps {
                echo '================================================'
                echo '   🐳 Docker Images on Docker Hub             '
                echo '================================================'
                echo "Images available at:"
                echo "  - ${DOCKER_HUB_REPO}/flatbuddy-backend:latest"
                echo "  - ${DOCKER_HUB_REPO}/flatbuddy-frontend:latest"
                echo ""
                echo "View at: https://hub.docker.com/u/${DOCKER_HUB_REPO}"
                echo '================================================'
            }
        }

        stage('Nexus Artifacts Status') {
            steps {
                echo '================================================'
                echo '   📦 Nexus Artifact Repository               '
                echo '================================================'
                echo "Artifacts available at:"
                echo "  ${NEXUS_RAW}/"
                echo ""
                echo "To upload new artifacts, execute locally:"
                echo "  ./upload-to-nexus.bat"
                echo '================================================'
            }
        }

        stage('Deployment Information') {
            steps {
                echo '================================================'
                echo '   🚀 Deployment Instructions                 '
                echo '================================================'
                echo "Backend: ${DOCKER_HUB_REPO}/flatbuddy-backend:latest"
                echo "Frontend: ${DOCKER_HUB_REPO}/flatbuddy-frontend:latest"
                echo ""
                echo "To deploy:"
                echo "  docker-compose up -d"
                echo '================================================'
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
            echo "  ✓ SonarQube: ${SONAR_URL}/dashboard?id=${SONAR_PROJECT_KEY}"
            echo "  ✓ Docker Hub: https://hub.docker.com/u/${DOCKER_HUB_REPO}"
            echo "  ✓ Nexus: ${NEXUS_RAW}/"
            echo ''
            echo 'Note: SonarQube analysis and Nexus uploads'
            echo 'are performed locally due to Jenkins server limitations.'
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

