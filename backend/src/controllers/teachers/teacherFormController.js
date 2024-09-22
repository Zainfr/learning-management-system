import { Teacher } from '../../models/teacher.models.js';
import { createTeacherFolder } from '../folderController.js';
import csvtojson from 'csvtojson'

export const importTeacherForm = async (req,res) => {
    try {
        const {teacher_name, email, password, mobile,subjects} = req.body;

        //const mentees_form = await Teacher.findById(mentees).populate('name');

        const newTeacher = new Teacher({
            teacher_name,
            email,
            password,
            mobile,
            subjects,
        });

        await newTeacher.save();
        await createTeacherFolder(newTeacher,subjects);
        res.status(200).json({success : true, msg : "Teacher Created Successfully"});
        console.log("Recieved Form Data : ", req.body);
    } catch (error) {
        if (error.code === 11000) {
            // This error code indicates a duplicate key error
            res.status(400).json({ success: false, msg: "Email or mobile number already exists" });
          } else {
            res.status(400).json({ success: false, msg: error.message });
          }
    }
}

export const importTeacherCsv = async (req,res) => {
    try {
        const teacherData = [];
        const jsonArray = await csvtojson().fromFile(req.file.path);

        jsonArray.forEach((user) => {
            const newTeacher = {
                teacher_name: user.teacher_name,
                email : user.email,
                password : user.password,
                mobile : user.mobile,
            }

            teacherData.push(newTeacher);
        });
        await Teacher.insertMany(teacherData);
        res.send({status: 200, success: true, msg: 'CSV IMPORTED'});
    } catch (error) {
        res.send({status: 400,success:false,msg:error.message});
    }
}