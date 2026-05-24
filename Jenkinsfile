pipeline {

    agent any

   

    environment {

        // גרסאות אוטומטיות לפי מספר build
        FRONTEND_IMAGE = "frontend-t.ch:v${env.BUILD_NUMBER}"
        BACKEND_IMAGE = "backend-t.ch:v${env.BUILD_NUMBER}"
    }

   steps {

    echo "Building Frontend..."
    bat "docker build -t ${FRONTEND_IMAGE} ./frontend"

    echo "Building Backend..."
    bat "docker build -t ${BACKEND_IMAGE} ./backend"
}
        }
 stage("push images to ECR") {
    steps {
        echo "Pushing images to ECR..."
    bat "docker tag ${FRONTEND_IMAGE} 028210901910.dkr.ecr.us-east-1.amazonaws.com/${FRONTEND_IMAGE}"
    bat "docker tag ${BACKEND_IMAGE}  028210901910.dkr.ecr.us-east-1.amazonaws.com/${BACKEND_IMAGE} "
bat "docker push 028210901910.dkr.ecr.us-east-1.amazonaws.com/${FRONTEND_IMAGE}"
bat "docker push 028210901910.dkr.ecr.us-east-1.amazonaws.com/${BACKEND_IMAGE}"
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
        mail to: 'tehila.ch12@gmail.com',
             subject: "Build Success: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
             body: "The pipeline for ${env.JOB_NAME} ran successfully."
    }

    failure {
        mail to: 'tehila.ch12@gmail.com',
             subject: "Build Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
             body: "Check Jenkins console for details."
    }


    always {

        echo "📌 Pipeline finished."

        // שליחת אימייל
        mail(
            to: 'tehila.ch12@gmail.com',

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