import EnvVars from '@src/constants/EnvVars'
import logger from 'jet-logger'
import nodeMailer from 'nodemailer'

export async function sendEmail(email: string, subject: string, html: string) {
  try {
    const transporter = nodeMailer.createTransport(EnvVars.MailTransporter)

    await transporter.sendMail({
      from: EnvVars.MailTransporter.auth?.user,
      to: email,
      subject: subject,
      html: html,
    })
  } catch (error) {
    logger.err(error)
    throw new Error('Failed to send verify email')
  }
}

export function getMailContent(link: string) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
      <style>
          /* Add your custom styles here */
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background: #FFFFFF;
              color: hsl(240, 10%, 3.9%);
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #F1F1F1;
              border-radius: 0.5rem;
              background: #FFFFFF;
              color: hsl(240, 10%, 3.9%);
          }
          .button {
              display: inline-block;
              background-color: hsl(142.1, 76.2%, 36.3%);
              color: hsl(355.7, 100%, 97.3%);
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 0.5rem;
              font-weight: bolder;
          }
          .button:hover {
              background-color: hsl(142.1, 76.2%, 36.3%);
          }
          .sub {
            color: hsl(240, 5.9%, 10%);
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Verify Your Account</h1>
          <p>Thank you for creating an account. Please click the button below to verify your email address.</p>
          <p>
              <a class="button" href="${link}">Verify Your Email</a>
          </p>
          <p class="sub">If you did not create an account, you can safely ignore this email.</p>
      </div>
  </body>
  </html>
  `
}

export function getNewPasswordMailContent(newPassword: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>
    <style>
        /* Add your custom styles here */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background: #FFFFFF;
            color: hsl(240, 10%, 3.9%);
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #F1F1F1;
            border-radius: 0.5rem;
            background: #FFFFFF;
            color: hsl(240, 10%, 3.9%);
        }
        .button {
            display: inline-block;
            background-color: hsl(142.1, 76.2%, 36.3%);
            color: hsl(355.7, 100%, 97.3%);
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 0.5rem;
            font-weight: bolder;
        }
        .button:hover {
            background-color: hsl(142.1, 76.2%, 36.3%);
        }
        .sub {
            color: hsl(240, 5.9%, 10%);
        }
        pre {
            background: #F8F8F8;
            border: 1px solid #E1E1E1;
            padding: 10px;
            border-radius: 0.5rem;
            font-family: 'Courier New', Courier, monospace;
            white-space: pre-wrap; /* Allows the text to wrap */
            word-wrap: break-word; /* Ensures long words are broken */
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reset password</h1>
        <p>Here is your reset password. Please use this password to login and change the password.</p>
        <pre>
${newPassword}
        </pre>
        <p class="sub">If you did not create an account, you can safely ignore this email.</p>
    </div>
</body>
</html>

  `
}
