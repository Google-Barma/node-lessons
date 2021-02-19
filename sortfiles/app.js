import * as fs from 'fs/promises'
import { resolve } from 'path'
import { isAccessible } from './lib/accessible.js'
import { handleError } from './lib/handlerror.js'
import SortFiles from './module/sort.js'
import program from './lib/commander.js'
import createDirname from './lib/dirname.js'

const { __dirname } = createDirname(import.meta.url)

program.parse(process.argv)
console.log(program.opts())
const output = program.opts().output

if (!(await isAccessible(output))) {
  await fs.mkdir(output)
}

try {
  const sorting = new SortFiles(output)
  await sorting.readFolder(resolve(__dirname, program.opts().folder))
} catch (e) {
  handleError(e)
}

console.log('Done. We can delete source folder')
