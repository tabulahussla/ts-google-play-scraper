#!/bin/ash
which ssh-agent || ( apk --update add openssh-client )
eval $(ssh-agent -s)
echo "$SSH_PRIVATE_KEY" | ssh-add -
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keyscan gitlab.com >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts
