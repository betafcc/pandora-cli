git_initials() {
  echo $(
    git config user.name |
    grep -o '\w\+' |
    grep -o '^\w'
  ) |
  sed 's/ //'
}
