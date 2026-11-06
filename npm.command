#!/bin/zsh

set -e
project_dir="${0:A:h}"
export PATH="$project_dir/.tools/node/bin:$PATH"
cd "$project_dir"
exec npm "$@"
