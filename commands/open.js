const {spawn} = require('../src/util')

module.exports = ({path = '.'}) =>
  spawn(`poetry run jupyter lab "${path}"`)
