#!/usr/bin/env bash

# Ensure that failed commands halt the script.
set -eo pipefail

# Extract the version from `package.json`.
VERSION=$(grep -m 1 version package.json | awk '{ print "v" $2 }' | sed 's/[\",]//g')

# Rename the local branch now we know the version number.
git branch -m release-$(git rev-parse --short HEAD^) release-$VERSION

# Publish the branch and the tagged release.
git push -u origin release-$VERSION
git push origin --tags

# Checkout the last branch we were on, hopefully `master`.
git checkout -

# Open the branch as a PR to merge it into master.
if [ -x "$(which open)" ]; then open "https://github.com/graze/pistachio/pull/new/release-$VERSION"; fi
