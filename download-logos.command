#!/bin/zsh

set -u
project_dir="${0:A:h}"
logo_dir="$project_dir/dist/logos"
mkdir -p "$logo_dir"

download_logo() {
  local name="$1"
  local domain="$2"
  local output="$logo_dir/$name.png"
  local temporary="$logo_dir/.$name.download"

  [[ -s "$output" ]] && return 0
  rm -f "$temporary"

  if curl --fail --location --silent --show-error --connect-timeout 12 \
    "https://logo.clearbit.com/$domain?size=128" --output "$temporary"; then
    mv "$temporary" "$output"
    return 0
  fi

  if curl --fail --location --silent --show-error --connect-timeout 12 \
    "https://www.google.com/s2/favicons?domain=$domain&sz=128" --output "$temporary"; then
    mv "$temporary" "$output"
    return 0
  fi

  rm -f "$temporary"
  return 1
}

download_logo "servicenow" "servicenow.com"
download_logo "aws" "aws.amazon.com"
download_logo "cisco-duo" "duo.com"
download_logo "crowdstrike" "crowdstrike.com"
download_logo "snowflake" "snowflake.com"
download_logo "epic" "epic.com"
download_logo "google-cloud" "cloud.google.com"
download_logo "oracle-health" "oracle.com"
download_logo "vercel" "vercel.com"

echo "Brand assets cached in $logo_dir"
