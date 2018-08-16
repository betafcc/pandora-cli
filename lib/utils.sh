project_pregex='\d{4}-\d{2}-\d{2}-\w+-[a-z0-9-]+'
notebook_pregex='\d+-\d{4}-\d{2}-\d{2}-\w+-[a-z0-9-]+'


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
