#!groovy

pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'make release'
            }
        }

        stage('Test') {
            steps {
                sh 'make test'
            }
        }

        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                sh 'make deploy'
            }
        }
    }
}
