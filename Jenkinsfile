#!groovy

pipeline {
    agent any

    try {
        stage('Checkout') {
            checkout scm
        }

        stage('Build') {
            sh 'make release'
        }

        stage('Test') {
            sh 'echo OK'
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
    catch (err) {
        throw err
    }
}
