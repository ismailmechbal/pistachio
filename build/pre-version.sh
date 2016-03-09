#!/usr/bin/env bash

# Ensure that failed commands halt the script.
set -eo pipefail

# Assert that we're releasing from the master branch.
[ "$(git rev-parse --abbrev-ref HEAD)" = 'master' ]

# Make sure we're not releasing a version that already exists.
git fetch --tags

# Create a temporary local branch.
git checkout -b release-$(git rev-parse --short HEAD)
