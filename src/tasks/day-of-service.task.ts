import cron from 'node-cron'

// Service
import * as DayOfServiceService from '@src/services/day-of-service.service'

// FIXME environment variables for Cron Expression
function scheduleGenerateDayOfService() {
  // Every day at 01:00 AM
  cron.schedule('0 1 * * *', () => DayOfServiceService.autoGenerate())
}

export default scheduleGenerateDayOfService
