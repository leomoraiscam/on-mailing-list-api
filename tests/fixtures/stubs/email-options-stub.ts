import { EmailOptions } from '@/dtos/email-options';

export const emailData = {
  attachmentFilePath: '../../../tmp/text.txt',
  fromName: 'Equipe mailing list',
  fromEmail: 'groupmailinglist@mail.com',
  toName: 'John Doe',
  toEmail: 'jonh_doe@mail.com',
  subject: 'Test e-mail',
  emailBody: 'Hello world attachment test',
  emailBodyHTML: '<b>Hello world attachment test</b>',
  attachment: [
    {
      filename: '../../../tmp/text.txt',
      contentType: 'text/plain',
    },
  ],
};

export const mailOptions: EmailOptions = {
  from: `${emailData.fromName} ${emailData.fromEmail}`,
  to: `${emailData.toName}<${emailData.toEmail}>`,
  subject: emailData.subject,
  text: emailData.emailBody,
  html: emailData.emailBodyHTML,
  attachments: emailData.attachment,
};
