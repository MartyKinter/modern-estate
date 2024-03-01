const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");


async function sendResetEmail(email) {
    try {
        const user = await User.findOne({ email });


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD
            }
        });

        const mail_configs = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: "Password reset",
            html: `<!DOCTYPE html>
                          <html lang="en" >
                          <head>
                          <meta charset="UTF-8">
                          <title>CodePen - OTP Email Template</title>


                          </head>
                          <body>
                          <!-- partial:index.partial.html -->
                          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                          <div style="margin:50px auto;width:70%;padding:20px 0">
                              <div style="border-bottom:1px solid #eee">
                              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">ModernEstate</a>
                              </div>
                              <p style="font-size:1.1em">Hi,</p>
                              <p>Thank you for choosing ModernEstate. Use the following link to reset your password</p>
                              <a href="http://localhost:5173/reset-password?token=${token}" style="font-size: 1.2em; color: #00466a; text-decoration: none;">Reset Password</a>
                              <p style="font-size:0.9em;">Regards,<br />ModernEstate Team</p>
                              <hr style="border:none;border-top:1px solid #eee" />
                              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                              <p>ModernEstate</p>
                              </div>
                          </div>
                          </div>
                          <!-- partial -->

                          </body>
                          </html>`};


        return new Promise((resolve, reject) => {
            transporter.sendMail(mail_configs, (error, info) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log('Email sent: ' + info.response);
                resolve(info.response);
            });
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports = { sendResetEmail };