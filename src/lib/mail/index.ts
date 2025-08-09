import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
});

export const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
};
