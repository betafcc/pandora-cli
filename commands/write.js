const {copyFile} = require('fs').promises

const config = require('../config')
const {spawn} = require('../src/util')
const namingUtil = require('../src/namingUtil')

module.exports = async ({ name, open }) => {
  const file = await namingUtil.notebook({name})

  await copyFile(
    config.templates.notebook,
    file
  )

  if (open) { await spawn(`poetry run jupyter lab ${file}`) }
}
