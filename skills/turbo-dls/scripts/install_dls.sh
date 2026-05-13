#!/usr/bin/env bash
set -euo pipefail

REPO_SLUG="ishaankothiyal-designer/v2-design-system-2026-refactor"
REPO_DIR="v2-design-system-2026-refactor"

print_help() {
  cat <<'EOF'
Install the DLS repo into a project folder.

Usage:
  install_dls.sh [target-directory]

Behavior:
  1. Ensure npm exists. If it does not, try to install Node/npm with a common system package manager.
  2. Clone the repo into <target-directory>/v2-design-system-2026-refactor.
  3. Run corepack pnpm install inside the cloned repo.

Notes:
  - Prefer GitHub CLI for cloning.
  - Fall back to git clone if gh is unavailable.
EOF
}

log() {
  printf '[dls-install] %s\n' "$1"
}

ensure_npm() {
  if command -v npm >/dev/null 2>&1; then
    log "npm already exists: $(npm --version)"
    return 0
  fi

  log "npm not found. Trying to install Node/npm."

  if command -v brew >/dev/null 2>&1; then
    brew install node
  elif command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update
    sudo apt-get install -y nodejs npm
  elif command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y nodejs npm
  elif command -v yum >/dev/null 2>&1; then
    sudo yum install -y nodejs npm
  elif command -v pacman >/dev/null 2>&1; then
    sudo pacman -Sy --noconfirm nodejs npm
  elif command -v winget >/dev/null 2>&1; then
    winget install OpenJS.NodeJS.LTS
  elif command -v choco >/dev/null 2>&1; then
    choco install -y nodejs-lts
  else
    cat <<'EOF' >&2
Could not install npm automatically.
Install Node.js LTS manually, then rerun this script.
EOF
    return 1
  fi

  if ! command -v npm >/dev/null 2>&1; then
    cat <<'EOF' >&2
npm is still not available after the install attempt.
Open a new shell session and rerun this script.
EOF
    return 1
  fi

  log "npm installed: $(npm --version)"
}

clone_repo() {
  local target_dir="$1"
  local repo_path="${target_dir}/${REPO_DIR}"

  if [[ -d "$repo_path/.git" ]]; then
    log "Repo already exists at $repo_path"
    return 0
  fi

  mkdir -p "$target_dir"

  if command -v gh >/dev/null 2>&1; then
    log "Cloning with gh repo clone"
    (
      cd "$target_dir"
      gh repo clone "$REPO_SLUG"
    )
    return 0
  fi

  if command -v git >/dev/null 2>&1; then
    log "gh not found. Falling back to git clone"
    git clone "https://github.com/${REPO_SLUG}.git" "$repo_path"
    return 0
  fi

  cat <<'EOF' >&2
Neither gh nor git is available.
Install GitHub CLI or git, then rerun this script.
EOF
  return 1
}

install_workspace() {
  local target_dir="$1"
  local repo_path="${target_dir}/${REPO_DIR}"

  if [[ ! -d "$repo_path" ]]; then
    echo "Expected repo at $repo_path" >&2
    return 1
  fi

  log "Installing workspace dependencies with corepack pnpm install"
  (
    cd "$repo_path"
    corepack enable
    corepack pnpm install
  )
}

main() {
  if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    print_help
    exit 0
  fi

  local target_dir
  target_dir="$(cd "${1:-.}" && pwd)"

  ensure_npm
  clone_repo "$target_dir"
  install_workspace "$target_dir"

  log "DLS repo is ready at ${target_dir}/${REPO_DIR}"
}

main "$@"
