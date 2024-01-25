const sgMail = require("@sendgrid/mail");

const API_KEY =
  "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";

//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(API_KEY);

const sendMail = async (msg) => {
  console.log(msg);
  await sgMail
    .send(msg)
    .then((response) => console.log("Email Sent ..."))
    .catch((error) => console.log(error.msg));
};
module.exports = {
  sendMail,
};
