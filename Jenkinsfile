pipeline {

    agent any

    parameters {
        string(
            name: 'DIR_PATH',
            description: 'enter project directory path'
        )
    }

    environment {

        // גרסאות אוטומטיות לפי מספר build
        FRONTEND_IMAGE = "frontend-t.ch:v${env.BUILD_NUMBER}"
        BACKEND_IMAGE = "backend-t.ch:v${env.BUILD_NUMBER}"
    }

    stages {

        stage('Build All Images') {

            steps {

                dir("${params.DIR_PATH}") {

                    echo "Building Frontend..."

                    bat "docker build -t ${FRONTEND_IMAGE} ./frontend"

                    echo "Building Backend..."

                    bat "docker build -t ${BACKEND_IMAGE} ./backend"
                }
            }
        }

        stage('Load to Minikube') {

            steps {

                echo "Loading Frontend to Minikube..."

                bat "minikube image load ${FRONTEND_IMAGE}"

                echo "Loading Backend to Minikube..."

                bat "minikube image load ${BACKEND_IMAGE}"
            }
        }

        stage('Deploy to K8s') {

            steps {

                echo "Updating Frontend Deployment..."

                bat """
                kubectl set image deployment/inventory-frontend-app frontend-app=${FRONTEND_IMAGE}
                """

                echo "Updating Backend Deployment..."

                bat """
                kubectl set image deployment/inventory-backend java-app=${BACKEND_IMAGE}
                """

                echo "Checking rollout status..."

                bat "kubectl rollout status deployment/inventory-frontend-app"

                bat "kubectl rollout status deployment/inventory-backend"
            }
        }
    }

   post {

    success {

        echo "✅ Pipeline completed successfully!"
    }

    failure {

        echo "❌ Pipeline failed!"
    }

    always {

        echo "📌 Pipeline finished."

        // שליחת אימייל
        mail(
            to: 'test@example.com',

            subject: "Job Status: ${currentBuild.currentResult}",

            body: """
            Jenkins Job Finished

            Status: ${currentBuild.currentResult}

            Build Number: ${env.BUILD_NUMBER}

            Job Name: ${env.JOB_NAME}
            """
        )
    }
}
}