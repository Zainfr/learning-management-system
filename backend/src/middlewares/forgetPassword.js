import bcrypt from 'bcrypt';
import { Student } from '../models/student.model.js';
import { Admin } from '../models/admin.model.js';
import { Teacher } from '../models/teacher.models.js';
import { sendOtpEmail } from './otp.js';
import { Otp } from '../models/otp.model.js';

// Request OTP and save it in MongoDB
// Generate 6-digit OTP
// Store OTP in MongoDB with a 10-minute expiration (thanks to `expires` index)
// Send OTP via email

export const requestOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Student.findOne({ email }) ||
                 await Teacher.findOne({ email }) ||
                 await Admin.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ email, otp });

    await sendOtpEmail(email, otp);
    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};

export const forgetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const storedOtp = await Otp.findOne({ email, otp });
    if (!storedOtp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Find user by email
    let user = await Student.findOne({ email }) ||
               await Teacher.findOne({ email }) ||
               await Admin.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await user.constructor.findOneAndUpdate({ email }, { password: hashedPassword });

    // Delete OTP after successful password change
    await Otp.deleteOne({ email });

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating the password:', error);
    res.status(500).json({ success: false, message: 'Error updating the password' });
  }
};
