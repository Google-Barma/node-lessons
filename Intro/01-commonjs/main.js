const { info, logger } = require('./module')
const My = require('./moduleClass')

info('Test')
logger('Test')

const variable = new My()

variable.info('Test variable')
variable.logger('Test variable')
