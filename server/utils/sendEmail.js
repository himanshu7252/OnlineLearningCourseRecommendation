const { Resend } = require('resend');

/**
 * Sends an email using the Resend API.
 * @param {Object} options Options containing recipient email, subject, text message, and HTML content.
 */
const sendEmail = async (options) => {
  // Use RESEND_API_KEY from environment variables (fallback to SMTP_PASS if configured there)
  const apiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASS;

  if (!apiKey || apiKey.startsWith('re_your_api_key')) {
    throw new Error('Please configure RESEND_API_KEY in your server/.env file');
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.FROM_EMAIL || 'Acme <onboarding@resend.dev>';

  const response = await resend.emails.send({
    from: fromEmail,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  });

  if (response.error) {
    console.error('Resend API Error:', response.error);
    throw new Error(response.error.message || 'Resend failed to send email');
  }

  console.log(`Email sent successfully via Resend: ${response.data.id}`);
  return response.data;
};

module.exports = sendEmail;
