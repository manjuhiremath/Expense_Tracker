import express from 'express';
import SibApiV3Sdk from 'sib-api-v3-sdk';

var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.MAILING;
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const mailing =  async (req, res) => {
  const { email } = req.body;
    // email = "manjuhiremath1352@gmail.com";
  if (!email) {
    return res.status(400).send({ error: 'Email is required' });
  }

  const emailData = {
    sender: { name: 'Expense Tracker Service', email: 'manjuhiremath1352@gmail.com' },
    to: [{ email }],
    subject: 'Password Reset Request',
    htmlContent: '<p>Click here to reset your password.</p>',
  };

  try {
    await apiInstance.sendTransacEmail(emailData);
    res.status(200).send({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ error: 'Failed to send email' });
  }
}