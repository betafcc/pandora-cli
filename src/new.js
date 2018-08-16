const moment = require('moment')
const slugify = require('@sindresorhus/slugify')
const {mkdir, cd, touch, spawn, exec} = require('./util')

const projectSlug = async (name) =>
  `${moment().format('YYYY-MM-DD')}-${slugify(await gitInitials())}-${slugify(name)}`

const gitInitials = async () =>
  (await exec('git config user.name'))
    .stdout
    .toString()
    .split(/\s+/)
    .map(s => s[0])
    .join('')

module.exports = {
  projectSlug,
  mkdir,
  cd,
  touch,
  spawn
  // writeToml,
  // readToml,
  // tomlDate
}
