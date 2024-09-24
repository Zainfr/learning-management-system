import { Admin } from '../models/admin.model.js';
import { Student } from '../models/student.model.js';
import { Teacher } from '../models/teacher.models.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

export const login = async (req,res) => {
    const { email , password } = req.body;

    try {
        let user = await Teacher.findOne({ email });
        let userType = 'Teacher';

        if(!user){
            user = await Admin.findOne({ email });
            userType = 'Admin';
        }

        if(!user){
            user = await Student.findOne({ email });
            userType = 'Student';
        }

        if(!user){
            return res.status(404).json({success : false, message : 'User Does Not Exist'});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({success : false, message : 'Incorrect Password'});
        }

        const token = jwt.sign({id : user._id, type : userType}, process.env.JWT_SECRET, { expiresIn : "24h"});

        res.status(200).json({
            success : true,
            token,
            user : {
                id : user._id,
                name : userType === "Teacher" ? user.teacher_name : userType === "Admin" ? user.name : user.name,
                type : userType,
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}