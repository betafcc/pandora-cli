const config = require('../config')
const {
  projectSlug,
  clone,
  withChdir,
  spawn,
  tomlFileDeepAssign,
  copyFile
} = require('../src/new')

module.exports = async ({ name, open }) => {
  const _projectSlug = await projectSlug(name)

  // create project directory from boilerplate
  await clone(
    'https://github.com/betafcc/data-science-boilerplate',
    _projectSlug,
    false
  )
  await withChdir(_projectSlug, async () => {
    // init project
    await spawn('make init')

    // add project metadata
    await tomlFileDeepAssign('pyproject.toml', {
      tool: { pandora: {
        name,
        date: new Date()
      }}
    })

    // run default boilerplate install
    await spawn('make install')

    if (open) {
      const file = `0-${_projectSlug}.ipynb`
      await copyFile(
        config.templates.notebook,
        file
      )
      await spawn(`poetry run jupyter lab ${file}`)
    }
  })
}
