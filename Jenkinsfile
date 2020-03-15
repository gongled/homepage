#!groovy

pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'make prep'
            }
            steps {
                sh 'make build'
            }
            steps {
                sh 'make check'
            }
            steps {
                sh 'make pack'
            }
            steps {
                sh 'make publish'
            }
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
