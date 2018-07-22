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
