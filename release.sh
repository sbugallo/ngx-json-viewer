#!/usr/bin/env zsh

PACKAGE_DIR="$(pwd)"
REMOTE=$(git remote get-url origin)
TMP_DIR=$(mktemp -d)
cd $TMP_DIR
git init .
git remote add origin $REMOTE
git fetch
REMOTE_EXISTS="true"
if [ ! $(git checkout origin/release) ]; then
    git checkout -b release
    REMOTE_EXISTS="false"
fi
rm -rf ./*
cd $PACKAGE_DIR
cp -r ${${$(ls dist)//*node_modules*/}/#/dist\/} $TMP_DIR

# Commit
cd $TMP_DIR
git add .
read "message?Enter release commit message: "
git commit -m "chore: 🤖 $message"

if [ $REMOTE_EXISTS = "false" ]; then
    git push --set-upstream origin release
else
    git push
fi
