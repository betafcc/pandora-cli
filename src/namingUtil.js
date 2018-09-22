const {readdir} = require('fs').promises
const moment = require('moment')
const slugify = require('@sindresorhus/slugify')

const {exec} = require('./util')

const regex = {
  project: /^\d\d\d\d-\d\d-\d\d-[a-z]+-[a-z0-9\-]+[a-z0-9]$/,
  notebook: /^\d+-\d\d\d\d-\d\d-\d\d-[a-z]+-[a-z0-9\-]+[a-z0-9].ipynb$/
}

const parse = str =>
  (regex.project.test(str)) ? {type: 'project', ..._parseProject(str)}
    : (regex.notebook.test(str)) ? {type: 'notebook', ..._parseNotebook(str.slice(0, -6))}
      : null

const _parseProject = str => ({
  date: moment(str.slice(0, 10) + 'T00:00:00Z'),
  initials: str.slice(11).match(/^\w+/)[0],
  nameSlug: str.slice(11).match(/^\w+-([a-z0-9\-]+[a-z0-9])$/)[1]
})

const _parseNotebook = str => {
  const [_, n, rest] = str.match(/^(\d+)-(.+)$/)
  return {index: Number.parseInt(n), ..._parseProject(rest)}
}

const project = async ({
  date,
  author,
  name
}) =>
  (date === undefined) ? await project({ date: new Date(), author, name })
    : (author === undefined) ? await project({
      date,
      author: (await exec('git config user.name')).stdout.toString(),
      name
    })
      : _project({ date, author, name })

const _project = ({
  date,
  author,
  name
}) => (
  moment(date).format('YYYY-MM-DD') + '-' +
  slugify(author.split(/\s+/).map(s => s[0]).join('')) + '-' +
  slugify(name)
)

const notebook = async ({
  index,
  date,
  author,
  name
}) =>
  (index === undefined) ? await notebook({
    index: 1 + (await _currentDirMaxIndex() || -1),
    date,
    author,
    name
  })
    : index + '-' + await project({index, date, author, name})

const _currentDirMaxIndex = async () =>
  (await readdir(process.cwd()))
    .map(parse)
    .filter(el => !!el)
    .map(el => el.index)
    .sort()
    [0]

module.exports = {
  regex,
  parse,
  project,
  notebook
}
