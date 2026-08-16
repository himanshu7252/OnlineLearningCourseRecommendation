const { Resend } = require('resend');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('Loaded API Key:', process.env.RESEND_API_KEY);
console.log('Loaded From Email:', process.env.FROM_EMAIL);

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey || apiKey.startsWith('re_your_api_key')) {
  console.error('ERROR: API Key is not configured correctly in .env!');
  process.exit(1);
}

const resend = new Resend(apiKey);

// We try sending to the email registered in the system (or fallback to user's personal email)
const testEmail = 'himanshujangid7252@gmail.com'; 

console.log(`Attempting to send test email to ${testEmail}...`);

resend.emails.send({
  from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
  to: testEmail,
  subject: 'EduRec Resend Test',
  html: '<p>If you receive this, the Resend integration is working perfectly!</p>'
})
.then(response => {
  if (response.error) {
    console.error('Resend Error Response:', response.error);
  } else {
    console.log('Resend Success Response:', response.data);
  }
})
.catch(error => {
  console.error('Unexpected Exception:', error);
});
