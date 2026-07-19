import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: parseInt(process.env.EMAIL_PORT || '587') === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Ayurdnyanam" <noreply@ayurdnyanam.com>',
    to: email,
    subject: 'Your Login OTP - Ayurdnyanam',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; text-align: center; margin-bottom: 30px;">Ayurdnyanam Login</h2>
        <p style="color: #334155; font-size: 16px;">Hello,</p>
        <p style="color: #334155; font-size: 16px;">Your One-Time Password (OTP) for accessing your account is:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; border: 1px dashed #cbd5e1;">
          <h1 style="color: #10b981; font-size: 36px; letter-spacing: 4px; margin: 0;">${otp}</h1>
        </div>
        
        <p style="color: #64748b; font-size: 14px;">This OTP is valid for the next <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5;">
          Please do not reply to this email.<br/>
          This is an automatically generated message from the Ayurdnyanam system.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendCredentialsEmail = async (email: string, password: string, loginUrl: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Ayurdnyanam" <noreply@ayurdnyanam.com>',
    to: email,
    subject: 'Welcome! Your Account Credentials',
    html: `
      <h2>Welcome to Ayurdnyanam!</h2>
      <p>Your account has been created successfully. Below are your login credentials:</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p>Please login to your account and change your password as soon as possible.</p>
      <a href="${loginUrl}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Login to Dashboard</a>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Credentials email sent: %s', info.messageId);
    if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending credentials email:', error);
  }
};
