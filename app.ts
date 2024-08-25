import { SMTPServer } from 'smtp-server';
import nodemailer from 'nodemailer';
import { simpleParser, ParsedMail } from 'mailparser';

const server = new SMTPServer({
  onData(stream, _session, callback) {
    simpleParser(stream)
      .then((parsed) => sendEmail(parsed))
      .catch((err) => {
        console.error("Parsing error:", err);
        callback(err);
      })
      .finally(() => {
        stream.on('end', callback);
      });
  },
  disabledCommands: ['STARTTLS', 'AUTH'],
});

server.listen(25, () => {
  console.log('SMTP server is listening on port 25');
});

async function sendEmail(email: ParsedMail) {
  try {
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

    const info = await transporter.sendMail({
      from: process.env.FROM,
      to: process.env.TO,
      subject: email.subject,
      text: email.text,
      html: email.html || email.textAsHtml, // html property has more priority if available
    });

    console.log('Email sent:', info.messageId);
    console.log('Envelope:', info.envelope);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
