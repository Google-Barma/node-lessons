console.log(process.execPath)
console.log(process.version)
console.log(process.platform)
console.log(process.arch)
console.log(process.title)
console.log(process.pid)
console.log(process.cwd())
console.log(process.argv)
// console.log(process.env)

process.on('exit', (code) => {
  console.log('Exit: ' + code)
})
process.exit(1)
