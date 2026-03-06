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

export SPRING_PROFILES_ACTIVE=h2

echo "Starting backend with H2 (file-based, persistent)"
exec mvn -DskipTests spring-boot:run
