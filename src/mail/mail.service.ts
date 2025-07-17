import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  } as SMTPTransport.Options);

  async sendOtpEmail(to: string, code: string) {
    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verify your email</title>
    <style>
      /* ---- Mobile reset ---- */
      @media only screen and (max-width: 620px) {
        .container { width: 100% !important; padding: 0 16px !important; }
        .content   { padding: 32px 24px !important; }
        h1         { font-size: 24px !important; }
      }
      /* ---- Button hover ---- */
      .btn:hover { background:#0051a8 !important; }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#f5f8fb; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f5f8fb">
      <tr>
        <td align="center">
          <!--[if (gte mso 9)|(IE)]>
          <table role="presentation" width="600"><tr><td>
          <![endif]-->

          <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:40px auto;">
            <tr>
              <td bgcolor="#ffffff" class="content" style="border-radius:8px; padding:48px; box-shadow:0 4px 18px rgba(0,0,0,0.05);">
                
                <h1 style="margin:0 0 24px; color:#333333; font-weight:600; font-size:28px;">
                  Verify your e‑mail
                </h1>

                <p style="margin:0 0 16px; color:#5f6b7b; font-size:15px; line-height:1.5;">
                  Thanks for creating an account with <b>Yuva</b>.  
                  To finish signing up, please confirm your e‑mail address by entering the one‑time code below:
                </p>

                <p style="margin:0 0 32px;">
                  <span style="display:inline-block; background:#f1f4f9; border-radius:6px; padding:16px 32px; font-size:32px; letter-spacing:8px; font-weight:700; color:#0047ba;">
                    ${code}
                  </span>
                </p>

                <p style="margin:0 0 24px; color:#5f6b7b; font-size:15px;">
                  This code expires in <b>10 minutes</b>.  
                  If you didn’t request it, you can safely ignore this e‑mail.
                </p>

                <a href="${process.env.FRONTEND_URL}" class="btn" 
                   style="display:inline-block; background:#036fc7; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:4px; font-size:16px; font-weight:600;">
                  Continue to Yuva
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 0; color:#98a3b6; font-size:12px;">
                &copy; ${new Date().getFullYear()} RR ISPAT – Yuva App
              </td>
            </tr>
          </table>

          <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Your Yuva verification code',
      html,
    });

    Logger.log(`OTP mail sent to ${to}`);
  }


  async sendCustomEmail(to: string, subject: string, message: string) {
    const html = this.buildHtml(subject, message);
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    Logger.log(`Custom mail sent to ${to}`);
  }

   private buildHtml(title: string, body: string) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        /* ---- Mobile reset ---- */
        @media only screen and (max-width: 620px) {
          .container { width: 100% !important; padding: 0 16px !important; }
          .content   { padding: 32px 24px !important; }
          h1         { font-size: 24px !important; }
        }

        /* ---- General body styling ---- */
        body {
          margin: 0;
          padding: 0;
          background-color: #f4f7fc;
          font-family: 'Arial', sans-serif;
        }
        table {
          width: 100%;
          background-color: #f4f7fc;
        }

        /* ---- Email container ---- */
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
        }

        /* ---- Title ---- */
        h1 {
          font-size: 28px;
          color: #333;
          font-weight: 600;
          text-align: center;
        }

        /* ---- Body Text ---- */
        p {
          font-size: 16px;
          color: #555;
          line-height: 1.5;
        }

        /* ---- Button Styling ---- */
        .btn {
          display: inline-block;
          background: linear-gradient(90deg, #007BFF, #0056b3);
          color: #fff;
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 4px;
          text-align: center;
          margin-top: 24px;
          transition: background-color 0.3s ease;
        }

        .btn:hover {
          background-color: #0056b3;
          cursor: pointer;
        }

        /* ---- Footer Styling ---- */
        footer {
          text-align: center;
          padding: 24px 0;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <table role="presentation">
        <tr>
          <td align="center">
            <table class="container" role="presentation">
              <tr>
                <td>
                  <h1>${title}</h1>
                  <p style="color:#555;">${body}</p>
                  <a href="${process.env.FRONTEND_URL}" class="btn">Continue to Yuva</a>
                </td>
              </tr>
              <tr>
                <td>
                  <footer>
                    <p>&copy; ${new Date().getFullYear()} RR ISPAT – Yuva App</p>
                    <p>If you didn't request this email, please ignore it.</p>
                  </footer>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }
}
