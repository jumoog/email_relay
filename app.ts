import { SMTPServer } from 'smtp-server';
import nodemailer from "nodemailer";
import { ParsedMail, simpleParser } from "mailparser";

const server = new SMTPServer(
  {
    onData(stream, _Session, callback) {
      simpleParser(stream, {}, (err, parsed) => {
        if (err) {
          console.log("Error:", err);
        } else {
          sendEmail(parsed);
          stream.on("end", callback);
        }
      });
      return callback();
    },
    disabledCommands: ["STARTTLS", "AUTH"],
  });
server.listen(25);

async function sendEmail(email: ParsedMail) {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
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

  transporter.sendMail({
    from: String(email.from),
    to: String(email.to),
    subject: email.subject,
    text: email.text,
    html: email.textAsHtml,
  }, (_err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
  });
}
