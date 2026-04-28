import { SMTPServer } from 'smtp-server';
import nodemailer from 'nodemailer';
import { simpleParser, ParsedMail } from 'mailparser';

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  tls: {
    maxVersion: 'TLSv1.3',
    minVersion: 'TLSv1.2',
  },
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const server = new SMTPServer({
  onData(stream, _session, callback) {
    simpleParser(stream)
      .then((parsed) => sendEmail(parsed))
      .then(() => callback())
      .catch((err) => {
        console.error("Error:", err);
        callback(err);
      });
  },
  disabledCommands: ['STARTTLS', 'AUTH'],
});

server.listen(25, () => {
  console.log('SMTP server is listening on port 25');
});

async function sendEmail(email: ParsedMail) {
  const info = await transporter.sendMail({
    from: process.env.FROM,
    to: process.env.TO,
    subject: email.subject,
    text: email.text,
    html: email.html || email.textAsHtml,
  });

  console.log('Email sent:', info.messageId);
  console.log('Envelope:', info.envelope);
}
