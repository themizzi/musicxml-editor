FROM debian:trixie-slim

ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=1000

ENV DEBIAN_FRONTEND=noninteractive
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        ca-certificates \
        chromium \
        chromium-driver \
        curl \
        docker-cli \
        fonts-liberation \
        git \
        jq \
        nodejs \
        npm \
        sudo \
        tar \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid "${USER_GID}" "${USERNAME}" \
    && groupadd -f docker \
    && useradd --uid "${USER_UID}" --gid "${USER_GID}" -m -s /bin/bash "${USERNAME}" \
    && usermod -aG docker "${USERNAME}" \
    && echo "${USERNAME} ALL=(root) NOPASSWD:ALL" > "/etc/sudoers.d/${USERNAME}" \
    && chmod 0440 "/etc/sudoers.d/${USERNAME}" \
    && install -d -m 0755 -o "${USERNAME}" -g "${USERNAME}" "/home/${USERNAME}/.local" \
    && su - "${USERNAME}" -c 'curl -fsSL https://opencode.ai/install | bash'

RUN curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

ARG TARGETARCH
ARG COG_VERSION=7.0.0

RUN set -euo pipefail \
    && case "${TARGETARCH}" in \
        amd64) COG_ARCH="x86_64" ;; \
        arm64) COG_ARCH="aarch64" ;; \
        *) echo "Unsupported TARGETARCH: ${TARGETARCH}" >&2; exit 1 ;; \
    esac \
    && RELEASE_API_BASE="https://api.github.com/repos/cocogitto/cocogitto/releases/tags" \
    && RELEASE_TAG="v${COG_VERSION}" \
    && if ! RELEASE_JSON="$(curl -fsSL "${RELEASE_API_BASE}/${RELEASE_TAG}")"; then \
        RELEASE_TAG="${COG_VERSION}"; \
        RELEASE_JSON="$(curl -fsSL "${RELEASE_API_BASE}/${RELEASE_TAG}")" || { \
            echo "Pinned Cocogitto version ${COG_VERSION} was not found in GitHub releases." >&2; \
            exit 1; \
        }; \
    fi \
    && ASSET_URL="$(printf '%s' "${RELEASE_JSON}" | jq -r --arg arch "${COG_ARCH}" '[.assets[]?.browser_download_url | select(test("-" + $arch + "-unknown-linux-"))][0] // empty')" \
    && if [[ -z "${ASSET_URL}" ]]; then \
        echo "No Linux release asset matched architecture ${COG_ARCH} for tag ${RELEASE_TAG}." >&2; \
        exit 1; \
    fi \
    && curl -fsSL "${ASSET_URL}" -o /tmp/cog.tar.gz \
    && mkdir -p /tmp/cog-extract \
    && tar -xzf /tmp/cog.tar.gz -C /tmp/cog-extract \
    && COG_BIN="$(find /tmp/cog-extract -type f -name cog | head -n 1)" \
    && if [[ -z "${COG_BIN}" ]]; then \
        echo "Downloaded archive did not contain a cog binary." >&2; \
        exit 1; \
    fi \
    && install -m 0755 "${COG_BIN}" /usr/local/bin/cog \
    && rm -rf /tmp/cog.tar.gz /tmp/cog-extract \
    && cog --version

ENV PATH="/home/${USERNAME}/.local/bin:${PATH}"
ENV EDITOR="code --wait"

USER ${USERNAME}
