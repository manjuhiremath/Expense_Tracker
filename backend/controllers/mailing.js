import express from 'express';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import { Users } from '../models/User.js';
import { forgotPasswordRequests } from '../models/forgotPasswordRequests.js';
import { UUIDV4 } from 'sequelize';
import bcrypt from 'bcrypt';


var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.MAILING;
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const mailing =  async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({where:{email:email}});
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
//   console.log(user);
//   const requestId = UUIDV4();
//   requestId.toString();
  const forgetRequest = await forgotPasswordRequests.create({
    // id: requestId,
    UserId: user.id,
    isActive: true
  });
//   console.log(forgetRequest.id);
  const requestId = forgetRequest.id;

  const resetUrl = `http://localhost:3000/api/password/resetpassword/${requestId}`;
  const emailData = {
    sender: { name: 'Expense Tracker', email: 'manjuhiremath1352@gmail.com' },
    to: [{ email }],
    subject: 'Password Reset Request',
    htmlContent: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
  };

  try {
    await apiInstance.sendTransacEmail(emailData);
    res.status(200).send({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ error: 'Failed to send email' });
  }
};


 export const resetPasswordId= async(req, res) => {
    const { id } = req.params;
    const request = await forgotPasswordRequests.findOne({where:{ id: id, isActive: true }});
    if (!request) {
      return res.status(400).send({ error: 'Invalid or expired password reset link' });
    }
  
    res.status(200).send('<form action="http://localhost:3000/api/password/updatepassword" method="POST" ><input type="hidden" name="id" value="' + id + '" /><input type="password" name="newPassword" placeholder="Enter new password" required /><button type="submit">Submit</button></form>');
  };
  
   export const updatePassword= async (req, res) => {
    // console.log(req.body);
    const { id, newPassword } = req.body;
    const request = await forgotPasswordRequests.findOne({where:{id:id,isActive:true}});
    // console.log(id)
    if (!request) {
        return res.status(400).send('<html><body><h1 style="font-family: Arial, sans-serif; color: red;">Link Expired. Please request again for password reset.</h1></body></html>');

    }
    // console.log(request)
    const user = await Users.findOne({ where: { id: request.UserId } });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
  
    user.password = await bcrypt.hash(newPassword, 10);
    request.isActive = false;
    await user.save();
    console.log(user.password)
    res.status(200).send('<html><body><h1>Password updated successfully</h1></body></html>');
  };