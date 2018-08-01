new_command() {
  local name="${1}"
  local project_dir=$(project_slug "$name")
  mkdir "${project_dir}"
  cd "${project_dir}"

  poetry init -n -q

  echo "" >> pyproject.toml
  echo "[tool.pandora]" >> pyproject.toml
  echo "name = \"$name\"" >> pyproject.toml
  echo "date = $(date -I)" >> pyproject.toml
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
