// Import Firebase Functions
const functions = require("firebase-functions");

// Import dotenv to read .env file
require("dotenv").config();

// Import SendGrid mail package
const sgMail = require("@sendgrid/mail");

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/*
|--------------------------------------------------------------------------
| Email Function
|--------------------------------------------------------------------------
| This function sends an email when called from the frontend.
| It is secure because the API key is stored in .env (not exposed).
|--------------------------------------------------------------------------
*/

exports.sendEmail = functions.https.onCall(async (data, context) => {
  try {
    const msg = {
      to: data.to, // recipient email (from frontend)
      from: "victornwanodi@gmail.com", // must be verified in SendGrid
      subject: data.subject,
      text: data.text,
      html: data.html,
    };

    await sgMail.send(msg);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email Error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send email"
    );
  }
});