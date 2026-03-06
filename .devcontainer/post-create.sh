#!/usr/bin/env bash
set -euo pipefail

mkdir -p /home/dev/.local/share/opencode
rm -f /home/dev/.local/share/opencode/auth.json
ln -s /tmp/opencode-auth.json /home/dev/.local/share/opencode/auth.json

if [ -S /var/run/docker.sock ]; then
  sudo chgrp docker /var/run/docker.sock || true
  sudo chmod 660 /var/run/docker.sock || true
fi
