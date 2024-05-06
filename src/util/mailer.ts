import EnvVars from '@src/constants/EnvVars'
import logger from 'jet-logger'
import nodeMailer from 'nodemailer'

export async function sendEmail(email: string, subject: string, text: string) {
  try {
    const transporter = nodeMailer.createTransport(EnvVars.MailTransporter)

    await transporter.sendMail({
      from: EnvVars.MailTransporter.auth?.user,
      to: email,
      subject: subject,
      text: text,
    })
  } catch (error) {
    logger.err(error)
    throw new Error('Failed to send verify email')
  }
}
