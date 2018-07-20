pandora_version() {
  echo '0.1.0'
}


pandora_dir() {
  if [ -z "$PANDORA_DIR" ]; then
    local current_script_path=${BASH_SOURCE[0]}
    export PANDORA_DIR
    PANDORA_DIR=$(cd "$(dirname "$(dirname "$current_script_path")")" || exit; pwd)
  fi

  echo "$PANDORA_DIR"
}
