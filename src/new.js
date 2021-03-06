const {copyFile} = require('fs').promises

const moment = require('moment')
const slugify = require('@sindresorhus/slugify')
const {spawn, exec, withChdir, tomlFileDeepAssign, clone} = require('./util')

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
  clone,
  withChdir,
  spawn,
  tomlFileDeepAssign,
  copyFile
}
