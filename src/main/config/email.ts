import { EmailOptions } from '@/dtos/email-options';

const attachments = [
  {
    filename: 'clean-architecture.pdf',
    path: 'https://otaviolemos.github.io/clean-architecture.pdf',
  },
];

const fromName = 'MailingList';
const fromEmail = 'mainling_list_contact@mail.com';

export function getEmailOptions(): EmailOptions {
  const from = `${fromName} | theWiseDev <${fromEmail}>`;
  const to = '';

  const mailOptions: EmailOptions = {
    host: 'smtp.mailtrap.io',
    port: 2525,
    username: '947bdd50600a6b',
    password: '4c510740359934',
    from,
    to,
    subject: 'Attachments e-mail',
    text: 'Hello world attachment test',
    html: '<b>Hello world attachment test</b>',
    attachments,
  };
  return mailOptions;
}
