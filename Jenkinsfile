#!groovy

node('packer') {

    currentBuild.result = "SUCCESS"

    try {
       stage('Checkout'){
          checkout scm
       }

       stage('Build'){
         sh 'make release'
       }

       stage('Test'){
         sh 'echo OK'
       }

       stage('Deploy'){
         sh 'make TRANSPORT=local deploy'
       }
    }
    catch (err) {
        throw err
    }
}
