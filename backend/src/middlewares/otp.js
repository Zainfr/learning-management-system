import nodemailer from "nodemailer";

//configure the package : 
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
});

export const sendOtpEmail = async(email,otp) => {
    const mailOption = {
        from : 'aiktclms@gmail.com',
        to : email,
        subject : 'Password Reset OTP',
        text : `Your OTP for password reset is ${otp}. This is valid for 10 minutes only.`
    };

    try {
        await transporter.sendMail(mailOption);
        console.log('OTP sent Successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
}