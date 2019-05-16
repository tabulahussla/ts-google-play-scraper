#!/bin/ash

apk --update add coreutils

git remote set-url origin "https://gitlab.com/$CI_PROJECT_PATH.git"
git config --global credential.helper store

GIT_ASKPASS_USER=$(echo "$GIT_USERNAME" | base64 -d)
GIT_ASKPASS_PASSWORD=$(echo "$GIT_PASSWORD" | base64 -d)

export GIT_ASKPASS_USER
export GIT_ASKPASS_PASSWORD
export GIT_ASKPASS="yarn git-askpass-env"
