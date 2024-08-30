var nodemailer = require('nodemailer')

const sendEMail = async(option)=>{
    // Here the transporter allows to send the mail to other mail ids 
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.MAIL_USERNAME,
            pass:process.env.MAIL_PASSWORD
        }
    })
    const mailOptions ={
        from:process.env.MAIL_USERNAME,
        to:option.email,
        subject:option.subject,
        text:option.html
    }
    await transporter.sendMail(mailOptions)

}

module.exports = sendEMail


