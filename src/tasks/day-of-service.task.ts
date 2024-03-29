import cron from 'node-cron'

// Service
import * as DayOfServiceService from '@src/services/day-of-service.service'
import EnvVars from '@src/constants/EnvVars'

function scheduleGenerateDayOfService() {
  // Every day at 01:00 AM
  cron.schedule(EnvVars.Rules.DayOfService.generateSchedule, () =>
    DayOfServiceService.autoGenerate(),
  )
}

export default scheduleGenerateDayOfService
