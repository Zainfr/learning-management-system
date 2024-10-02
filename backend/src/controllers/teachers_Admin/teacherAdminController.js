import { Admin } from '../../models/admin.model.js';
import { Student } from '../../models/student.model.js';
import { Teacher } from '../../models/teacher.models.js';
import { createTeacherFolder } from '../folderController.js';
import csvtojson from 'csvtojson'

export const importTeacherForm = async (req,res) => {
    try {
        const {teacher_name, email, password, mobile,subjects,mentees} = req.body;

        //const mentees_form = await Teacher.findById(mentees).populate('name');

        const newTeacher = new Teacher({
            teacher_name,
            email,
            password,
            mobile,
            subjects,
            mentees,
        });

        await newTeacher.save();
        await createTeacherFolder(newTeacher,subjects);
        res.status(200).json({success : true, msg : "Teacher Created Successfully"});
        console.log("Recieved Form Data : ", req.body);
    } catch (error) {
        if (error.code === 11000) {
            // This error code indicates a duplicate key error
            res.status(400).json({ success: false, msg: "Email or mobile number already exists" });
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

export const importAdmin = async (req,res) => {
    try {
        const {name, email, password, mobile} = req.body;
        const newAdmin = new Admin({
            name,
            email,
            password,
            mobile,
        });

        await newAdmin.save();
        res.status(200).json({success : true, msg : "Admin Created Successfully"});
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


//fetch teacher by their object id

export const getTeacher = async (req, res) => {
    try {
      const teacher = await Teacher.findById(req.params.id);
  
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      res.json({
        teacher,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

