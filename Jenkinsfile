#!groovy

pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'make release'
            }
        }

        stage('Test') {
            steps {
                sh 'echo OK'
            }
        }

        stage('Deploy') {
            when {
                branch 'production'
            }
            steps {
                sh 'make TRANSPORT=local deploy'
            }
        }
    }
}
