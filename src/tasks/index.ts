import logger from 'jet-logger'
import dayOfServiceTask from './day-of-service.task'

function schedule() {
  try {
    dayOfServiceTask()
  } catch (error) {
    logger.err('Error while running schedule tasks: ' + error)
  }
}

export default schedule
