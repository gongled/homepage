#!groovy

pipeline {
    agent any

    stages {
        stage('Prep') {
            steps {
                sh 'make prep'
            }
        }

        stage('Build') {
            steps {
                sh 'make build'
            }
        }

        stage('Check') {
            steps {
                sh 'make check'
            }
        }

        stage('Pack') {
            steps {
                sh 'make pack'
            }
        }

        stage('Publish') {
            steps {
                sh 'make publish'
            }
        }

        stage('Test') {
            steps {
                sh 'make test'
            }
        }

        stage('Release') {
            when {
                branch 'master'
            }
            steps {
                sh 'make release'
            }
        }

        stage('Clean') {
            steps {
                sh 'make clean'
            }
        }
    }
}
