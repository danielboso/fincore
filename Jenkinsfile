pipeline {
    agent any

    options {
        parallelsAlwaysFailFast()
        disableConcurrentBuilds(abortPrevious: true)
        skipDefaultCheckout(true)
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '5'))
        timestamps()
    }

    parameters {
        string(
            name: 'APP_PORT',
            defaultValue: '3000',
            description: 'Porta HTTP externa (Host) para a aplicação Fincore'
        )
        string(
            name: 'CONTAINER_PORT',
            defaultValue: '3000',
            description: 'Porta interna escutada pelo processo dentro do container'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Pular estágio de testes em caso de hotfix emergencial'
        )
    }

    environment {
        IMAGE_NAME               = 'fincore'
        IMAGE_TAG                = 'latest'
        APP_PORT                 = "${params.APP_PORT}"
        CONTAINER_PORT           = "${params.CONTAINER_PORT}"
        PNPM_STORE_DIR           = "${env.HOME}/.local/share/pnpm/store"
        DOCKER_BUILDKIT          = '1'
        COMPOSE_DOCKER_CLI_BUILD = '1'
    }

    stages {
        stage('Validate & Checkout') {
            steps {
                sh '''
                    set -euo pipefail
                    case "${APP_PORT}" in ''|*[!0-9]*) echo "❌ Erro: APP_PORT (${APP_PORT}) inválida." && exit 1 ;; esac
                    [ "${APP_PORT}" -ge 1024 ] && [ "${APP_PORT}" -le 65535 ] || { echo "❌ Erro: APP_PORT fora do intervalo (1024-65535)." && exit 1; }
                    case "${CONTAINER_PORT}" in ''|*[!0-9]*) echo "❌ Erro: CONTAINER_PORT (${CONTAINER_PORT}) inválida." && exit 1 ;; esac
                    [ "${CONTAINER_PORT}" -ge 1 ] && [ "${CONTAINER_PORT}" -le 65535 ] || { echo "❌ Erro: CONTAINER_PORT fora do intervalo (1-65535)." && exit 1; }
                '''
                checkout([
                    $class: 'GitSCM',
                    branches: scm.branches,
                    extensions: [[$class: 'CloneOption', depth: 1, noTags: true, reference: '', shallow: true, timeout: 5]],
                    userRemoteConfigs: scm.userRemoteConfigs
                ])
            }
        }

        stage('Quality Gate') {
            when {
                expression { return !params.SKIP_TESTS }
            }
            steps {
                sh '''
                    set -euo pipefail
                    if ! docker image inspect node:22-slim >/dev/null 2>&1; then
                        for i in 1 2 3; do docker pull node:22-slim && break || sleep 3; done
                    fi
                    docker build --target tester --output type=cacheonly .
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    set -euo pipefail
                    docker compose -p "${IMAGE_NAME}" build --parallel
                '''
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([string(credentialsId: 'FINCORE_DATABASE_URL', variable: 'DATABASE_URL')]) {
                    sh '''
                        set -euo pipefail
                        CASAOS_DIR="/var/lib/casaos/apps/${IMAGE_NAME}"
                        CASAOS_FILE="${CASAOS_DIR}/docker-compose.yml"
                        CONTAINER_NAME="${IMAGE_NAME}-app"

                        sed -e '/build:/,/image:/ { /image:/!d }' \
                            -e "s/port_map: \\"[0-9]*\\"/port_map: \\"${APP_PORT}\\"/g" \
                            -e "s/\\${APP_PORT}:\\${CONTAINER_PORT}/${APP_PORT}:${CONTAINER_PORT}/g" \
                            -e "s/PORT=\\${CONTAINER_PORT}/PORT=${CONTAINER_PORT}/g" \
                            docker-compose.yml > "/tmp/${IMAGE_NAME}-casaos.yml"

                        if [ -d "/var/lib/casaos/apps" ] && [ -w "/var/lib/casaos/apps" ]; then
                            mkdir -p "${CASAOS_DIR}" && cp "/tmp/${IMAGE_NAME}-casaos.yml" "${CASAOS_FILE}"
                        elif [ ! -f "${CASAOS_FILE}" ]; then
                            docker run --rm -i -v /var/lib/casaos/apps:/host-casaos-apps node:22-slim \
                                sh -c "mkdir -p /host-casaos-apps/${IMAGE_NAME} && cat > /host-casaos-apps/${IMAGE_NAME}/docker-compose.yml" \
                                < "/tmp/${IMAGE_NAME}-casaos.yml" 2>/dev/null || true
                        fi

                        EXISTING_PROJECT=$(docker inspect --format='{{index .Config.Labels "com.docker.compose.project"}}' "${CONTAINER_NAME}" 2>/dev/null || echo "")
                        if [ -n "$EXISTING_PROJECT" ] && [ "$EXISTING_PROJECT" != "${IMAGE_NAME}" ]; then
                            docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
                        fi

                        COMPOSE_TARGET="docker-compose.yml"
                        [ -f "${CASAOS_FILE}" ] && COMPOSE_TARGET="${CASAOS_FILE}"
                        docker compose -p "${IMAGE_NAME}" -f "$COMPOSE_TARGET" up -d --no-build --remove-orphans
                    '''
                }
            }
        }

        stage('Smoke Test (Healthcheck)') {
            steps {
                sh '''
                    set -euo pipefail
                    CONTAINER_NAME="${IMAGE_NAME}-app"

                    for i in $(seq 1 10); do
                        [ "$(docker inspect --format='{{.State.Status}}' "${CONTAINER_NAME}" 2>/dev/null || true)" = "running" ] && break
                        sleep 0.5
                    done

                    if [ "$(docker inspect --format='{{.State.Status}}' "${CONTAINER_NAME}" 2>/dev/null || true)" != "running" ]; then
                        echo "❌ Container não atingiu o estado 'running'."
                        docker logs --tail=40 "${CONTAINER_NAME}" || true
                        exit 1
                    fi

                    HEALTHY=false
                    for i in $(seq 1 30); do
                        if curl -fsS "http://127.0.0.1:${APP_PORT}/" >/dev/null 2>&1 || curl -fsS "http://host.docker.internal:${APP_PORT}/" >/dev/null 2>&1; then
                            HEALTHY=true
                            echo "✅ HTTP server respondendo na porta ${APP_PORT}!"
                            break
                        fi
                        sleep 1
                    done

                    if [ "$HEALTHY" != "true" ]; then
                        echo "❌ HTTP check na porta ${APP_PORT} falhou após 30s. Status: $(docker inspect --format='{{.State.Status}} (restarts={{.RestartCount}})' "${CONTAINER_NAME}" 2>/dev/null || true)"
                        docker logs --tail=60 "${CONTAINER_NAME}" || true
                        exit 1
                    fi

                    docker image prune -f --filter 'until=24h' || true
                '''
            }
        }
    }

    post {
        cleanup {
            cleanWs(cleanWhenNotBuilt: false, deleteDirs: true, disableDeferredWipeout: true, notFailBuild: true)
        }
    }
}
