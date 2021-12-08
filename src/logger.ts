import pino from 'pino'

const logger = pino()

export const log = (msg: any) => logger.info(msg)
export default logger