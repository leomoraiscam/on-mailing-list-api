import { EmailOptions } from '@/dtos/email-options';

const attachments = [
  {
    filename: 'example-file.pdf',
    path: process.env.FILE_PATH || '',
  },
];

export function getEmailOptions(): EmailOptions {
  const from = `Equipe mailing list' | OnMailingList <groupmailinglist@mail.com>`;
  const to = '';

  const mailOptions: EmailOptions = {
    from,
    to,
    subject: 'Attachments e-mail',
    text: 'Hello world attachment',
    html: '<b>Hello world attachment</b>',
    attachments,
  };

  return mailOptions;
}
