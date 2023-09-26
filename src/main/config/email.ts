import { EmailOptions } from '@/dtos/email-options';

const attachments = [
  {
    filename: 'clean-architecture.pdf',
    path: process.env.FILE_PATH || '',
  },
];

const fromName = 'Equipe mailing list';
const fromEmail = 'groupmailinglist@mail.com';

export function getEmailOptions(): EmailOptions {
  const from = `${fromName} | <${fromEmail}>`;
  const to = '';

  const mailOptions: EmailOptions = {
    from,
    to,
    subject: 'Attachments e-mail',
    text: 'Hello world attachment test',
    html: '<b>Hello world attachment test</b>',
    attachments,
  };

  return mailOptions;
}
