// const nodemailer = require('nodemailer');

// const sendEmail = async (options) =>{

//     // 1. Create a Transporter.
//     const transporter = nodemailer.createTransport({
//         //if we want to use any sevices like gmail or outlook. Not recommended in devlopment mode. we could get marke as a spammer. 
//          //TO USE GAMIL ACTIVATE " less secure app" options.
//         //service: 'Gmail',
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
       
//     })
//     // 2. Define the email options
//     const mailOptions = {
//         from: 'tour Nature <admin@email.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     }

//     // 3. Send the Email.
//     await transporter.sendMail(mailOptions)

// }

// module.exports = sendEmail;

const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
        }
    });

  // 2) Define the email options
  const mailOptions = {
    from: 'Jonas Schmedtmann <hello@jonas.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
