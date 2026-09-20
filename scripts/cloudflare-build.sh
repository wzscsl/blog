#!/bin/sh
set -eu
: "${CF_PAGES_URL:?Cloudflare Pages must provide CF_PAGES_URL}"
hugo --gc --minify --baseURL "${CF_PAGES_URL%/}/"
