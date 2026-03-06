#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

# Ensure the correct JDK (project targets Java 17). This avoids Lombok/javac issues
# if the system default JDK is newer.
if command -v /usr/libexec/java_home >/dev/null 2>&1; then
  JAVA_17_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || true)
  if [[ -n "${JAVA_17_HOME}" ]]; then
    export JAVA_HOME="${JAVA_17_HOME}"
    export PATH="${JAVA_HOME}/bin:${PATH}"
  fi
fi

# Load local env vars if present (kept out of git via .gitignore)
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

: "${DB_HOST:=localhost}"
: "${DB_PORT:=3306}"
: "${DB_NAME:=fedfdb}"
: "${DB_USER:=root}"

if [[ -z "${DB_PASSWORD:-}" ]]; then
  echo -n "Enter MySQL password for ${DB_USER}@${DB_HOST}:${DB_PORT}: "
  # silent prompt
  stty -echo
  read -r DB_PASSWORD
  stty echo
  echo
  export DB_PASSWORD
fi

export SPRING_PROFILES_ACTIVE=mysql

echo "Starting backend with MySQL (${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME})"
exec mvn -DskipTests spring-boot:run
