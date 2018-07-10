def call(command, cred = "${GIT_CRED_ID}") {
  withCredentials([sshUserPrivateKey(credentialsId: cred, keyFileVariable: 'GIT_KEYFILE')]) {
    sh 'echo ssh -i $GIT_KEYFILE -l git -o StrictHostKeyChecking=no \\"\\$@\\" > run_ssh.sh'
    sh 'chmod +x run_ssh.sh'
    withEnv(['GIT_SSH=./run_ssh.sh']) {
      sh command
    }
  }
}