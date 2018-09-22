const moment = require('moment')
const slugify = require('@sindresorhus/slugify')

const {exec} = require('./util')

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

module.exports = {
  // regex,
  // parse,
  project,
  _project
  // notebook
}
