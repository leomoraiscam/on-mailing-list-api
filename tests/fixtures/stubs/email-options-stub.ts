import { EmailOptions } from "@/dtos/email-options"

export const emailData = {
  attachmentFilePath: '../../../tmp/text.txt',
  fromName: 'MailingList',
  fromEmail: 'mainling_list_contact@mail.com',
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
}

export const mailOptions: EmailOptions = {
  host: 'localhost',
  port: 8671,
  username: 'fakeMailConfiguration',
  password: '123456',
  from: emailData.fromName + ' ' + emailData.fromEmail,
  to: emailData.toName + '<' + emailData.toEmail + '>',
  subject: emailData.subject,
  text: emailData.emailBody,
  html: emailData.emailBodyHTML,
  attachments: emailData.attachment
}