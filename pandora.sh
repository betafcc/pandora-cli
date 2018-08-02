#!/usr/bin/env bash

if [ "${BASH_SOURCE[0]}" != "" ]; then
  current_script_path="${BASH_SOURCE[0]}"
else
  current_script_path="$0"
fi

export PANDORA_DIR
PANDORA_DIR="$(dirname "$current_script_path")"

[ -d "$PANDORA_DIR" ] || echo '$PANDORA_DIR is not a directory'

# Add PANDORA to PATH
#
# if in $PATH, remove, regardless of if it is in the right place (at the front) or not.
# replace all occurrences - ${parameter//pattern/string}
PANDORA_BIN="${PANDORA_DIR}/bin"
[[ ":$PATH:" == *":${PANDORA_BIN}:"* ]] && PATH="${PATH//$PANDORA_BIN:/}"
# add to front of $PATH
PATH="${PANDORA_BIN}:$PATH"
