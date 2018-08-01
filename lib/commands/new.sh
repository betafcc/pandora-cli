new_command() {
  local name
  local run
  if [ "${1}" = "--run" ]; then
    name="${2}"
    run=true
  elif [ "${2}" = "--run" ]; then
    name="${1}"
    run=true
  else
    name="${1}"
    run=false
  fi

  local project_dir=$(project_slug "$name")
  mkdir "${project_dir}"
  cd "${project_dir}"

  poetry init -n -q

  echo "" >> pyproject.toml
  echo "[tool.pandora]" >> pyproject.toml
  echo "name = \"$name\"" >> pyproject.toml
  echo "date = $(date -I)" >> pyproject.toml

  mkdir src
  touch src/__init__.py

  poetry add \
    tornado="<5" \
    ipython \
    jupyterlab \
    numpy \
    pandas \
    matplotlib \
    altair

  if $run; then
    local file="0-${project_dir}.ipynb"
    cat "$(pandora_dir)/templates/basic.ipynb" > ${file}
    poetry run jupyter lab ${file}
  fi
}


project_slug() {
  local name="$1"
  echo "$(date -I)-$(slugify $(git_initials))-$(slugify "$name")"
}


git_initials() {
  echo $(
    git config user.name |
    grep -o '\w\+' |
    grep -o '^\w'
  ) |
  sed 's/ //'
}


slugify() {
  echo "$1" |
  iconv -f utf8 -t ascii//TRANSLIT |
  sed -E s/[~\^]+//g |
  sed -E s/[^a-zA-Z0-9]+/-/g |
  sed -E s/^-+\|-+$//g | tr A-Z a-z
}
