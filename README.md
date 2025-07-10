# Email Relay

A simple SMTP relay that forwards emails from programs that do not support TLSv1.3 to a modern SMTP server (e.g., Office365).  
Built with [Bun](https://bun.sh/), [smtp-server](https://github.com/nodemailer/smtp-server), [nodemailer](https://nodemailer.com/about/), and [mailparser](https://nodemailer.com/extras/mailparser/).

## Features

- Listens for incoming SMTP connections on port 25
- Parses incoming emails and forwards them to a configured SMTP server (TLS 1.2/1.3)
- Disables STARTTLS and AUTH for incoming connections (for legacy compatibility)
- Designed for containerized deployment (Docker support)

## Usage

### 1. Configuration

Set the following environment variables:

- `USER`: SMTP username for the target server (e.g., Office365)
- `PASS`: SMTP password
- `FROM`: Sender email address
- `TO`: Recipient email address

### 2. Run with Bun

Install dependencies:

```sh
bun install
```

Start the relay:

```sh
USER=your_user PASS=your_pass FROM=from@example.com TO=to@example.com bun app.ts
```

### 3. Run with Docker

Build the image:

```sh
docker build -t email-relay .
```

Run the container:

```sh
docker run -e USER=your_user -e PASS=your_pass -e FROM=from@example.com -e TO=to@example.com -p 25:25 email-relay
```

## How it works

- The server listens on port 25 for incoming SMTP messages.
- Incoming emails are parsed using `mailparser`.
- The parsed email is forwarded using `nodemailer` to the configured SMTP server (`smtp.office365.com` by default, port 587, TLS 1.2/1.3).

## Security

- Incoming SMTP does **not** support STARTTLS or AUTH (intended for trusted local use only).
- Outgoing SMTP uses TLS 1.2/1.3 for secure delivery.

## License

MIT

---

See [`app.ts`](app.ts) for implementation details.
