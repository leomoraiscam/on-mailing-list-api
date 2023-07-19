import { EmailOptions } from '@/usecases/send-email/ports/email-service'

const attachments = [{
  filename: 'clean-architecture.pdf',
  path: 'https://otaviolemos.github.io/clean-architecture.pdf'
}]

export function getEmailOptions (): EmailOptions {
  const from = 'Leonardo morais | theWiseDev <lmoraiss@gmail.com>'
  const to = ''
  const mailOptions: EmailOptions = {
    host: 'smtp.mailtrap.io',
    port: 2525,
    username: '947bdd50600a6b',
    password: '4c510740359934',
    from: from,
    to: to,
    subject: 'Mensagem de teste',
    text: 'Texto da mensagem',
    html: '<b> Texto da mensagem </b>',
    attachments: attachments
  }
  return mailOptions
}