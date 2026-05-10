#!/usr/bin/env bash
set -euo pipefail

# MongoDB logical backup with grandfather–father–son retention:
# - Daily: keep 30 days
# - Weekly: keep 90 days (snapshot taken on Sunday, local time)
# - Monthly: keep 365 days (snapshot on the 1st, local time)
#
# Requires: mongodump on PATH, MONGO_URI set.

: "${MONGO_URI:?Set MONGO_URI (e.g. mongodb://user:pass@mongo:27017/?authSource=admin&replicaSet=rs0)}"
: "${BACKUP_ROOT:=/backup}"

readonly DAILY_DIR="${BACKUP_ROOT}/daily"
readonly WEEKLY_DIR="${BACKUP_ROOT}/weekly"
readonly MONTHLY_DIR="${BACKUP_ROOT}/monthly"

STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "${DAILY_DIR}" "${WEEKLY_DIR}" "${MONTHLY_DIR}"

daily_file="${DAILY_DIR}/daily-${STAMP}.archive.gz"

mongodump --uri="${MONGO_URI}" --archive="${daily_file}" --gzip

# Daily retention: delete dumps older than 30 days
find "${DAILY_DIR}" -maxdepth 1 -type f -name 'daily-*.archive.gz' -mtime +30 -delete

# Weekly (Sunday): copy today's daily into weekly; retain 90 days
# date +%u: Mon=1 .. Sun=7
if [ "$(date +%u)" = '7' ]; then
  cp -a "${daily_file}" "${WEEKLY_DIR}/weekly-${STAMP}.archive.gz"
fi
find "${WEEKLY_DIR}" -maxdepth 1 -type f -name 'weekly-*.archive.gz' -mtime +90 -delete

# Monthly (1st): copy today's daily into monthly; retain 1 year
if [ "$(date +%d)" = '01' ]; then
  cp -a "${daily_file}" "${MONTHLY_DIR}/monthly-${STAMP}.archive.gz"
fi
find "${MONTHLY_DIR}" -maxdepth 1 -type f -name 'monthly-*.archive.gz' -mtime +365 -delete
