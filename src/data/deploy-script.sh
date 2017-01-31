bash
-c
apt update; apt install -y git; cd /tmp/; git clone https://$DEPLOYER_TOKEN$@github.com/$REPO_NAME$.git project; cd project; git checkout $COMMIT_SHA$; bash deploy.sh;
