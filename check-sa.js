// check-sa.js
const { JWT } = require('google-auth-library');
const key = require('./software-project-461904-bdf34d2e0dd7.json');   // adjust if key is elsewhere

(async () => {
  const auth = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
    subject: 'ajay.mishra@rrispat.com',        // Workspace user you’re impersonating
  });

  try {
    const { token } = await auth.getAccessToken();
    console.log('✅  Delegation OK, got access-token:', !!token);
  } catch (e) {
    console.error('❌  Still unauthorized:', e.response?.data || e.message);
  }
})();
