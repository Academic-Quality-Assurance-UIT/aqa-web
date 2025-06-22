pipeline {
    agent any 
    environment {
        FRONTEND_IMAGE = "hoanghy/aqa-client:latest"
        COMPOSE_FILE = "/opt/docker-compose.yml"
        API_URL = "http://localhost:8000/graphql"
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/aqaproject/aqa-client', branch: 'main'
            }
        }
        stage('Build Docker Image') {
            steps {
                echo "Building frontend Docker image..."
                sh """
                   docker build \\
                     --build-arg NEXT_PUBLIC_API_URL_V2=${API_URL} \\
                     -t ${FRONTEND_IMAGE} .
                   """
            }
        }
        stage('Deploy to Server') {
            steps {
                echo "Deploying frontend container..."
                sh "docker compose -f ${COMPOSE_FILE} up -d --no-deps --build frontend"
            }
        }
    }
}
