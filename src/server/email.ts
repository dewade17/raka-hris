import nodemailer from 'nodemailer';

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export class EmailDeliveryError extends Error {
  constructor(message = 'Email could not be sent.') {
    super(message);
    this.name = 'EmailDeliveryError';
  }
}

export class EmailConfigurationError extends EmailDeliveryError {
  constructor(message = 'Email delivery is not configured.') {
    super(message);
    this.name = 'EmailConfigurationError';
  }
}

export function assertEmailDeliveryConfigured() {
  if (!getGmailSmtpUser() || !getGmailSmtpAppPassword()) {
    throw new EmailConfigurationError();
  }
}

export async function sendEmail(input: SendEmailInput) {
  const user = getGmailSmtpUser();
  const pass = getGmailSmtpAppPassword();

  if (!user || !pass) {
    throw new EmailConfigurationError();
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  try {
    await transporter.sendMail({
      from: getEmailFromAddress() ?? user,
      to: input.to,
      subject: input.subject,
      text: input.text,
      ...(input.html ? { html: input.html } : {}),
    });
  } catch {
    throw new EmailDeliveryError('Email provider rejected the message.');
  }
}

function getGmailSmtpUser() {
  return process.env.GMAIL_SMTP_USER?.trim() || process.env.SMTP_USER?.trim() || null;
}

function getGmailSmtpAppPassword() {
  return process.env.GMAIL_SMTP_APP_PASSWORD?.trim() || process.env.SMTP_PASSWORD?.trim() || null;
}

function getEmailFromAddress() {
  return process.env.EMAIL_FROM?.trim() || null;
}
