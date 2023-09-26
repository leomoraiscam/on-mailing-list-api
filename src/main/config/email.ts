import { EmailOptions } from '@/dtos/email-options';

const attachments = [
  {
    filename: 'clean-architecture.pdf',
    path: process.env.FILE_PATH || '',
  },
];

const fromName = 'MailingList';
const fromEmail = 'mainling_list_contact@mail.com';

export function getEmailOptions(): EmailOptions {
  const from = `${fromName} | theWiseDev <${fromEmail}>`;
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
