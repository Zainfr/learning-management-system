import { Admin } from '../../models/admin.model.js';
import { Student } from '../../models/student.model.js';
import { Teacher } from '../../models/teacher.models.js';
import { createTeacherFolder } from '../folderController.js';
import { Subject } from '../../models/subjects.model.js'
import csvtojson from 'csvtojson'
import bcrypt from 'bcrypt'
export const importTeacherForm = async (req, res) => {
    try {
      const { teacher_name, email, password, mobile, subjects } = req.body;
  
      const newTeacher = new Teacher({
        teacher_name,
        email,
        password,
        mobile,
        subjects,
      });
  
      await newTeacher.save();
      await createTeacherFolder(newTeacher, subjects);
      
      res.status(200).json({ success: true, msg: "Teacher Created Successfully" });
      console.log("Received Form Data: ", req.body);
    } catch (error) {
      console.error(error); // Log error for debugging
      
      if (error.code === 11000) {
        res.status(400).json({ success: false, msg: "Email or mobile number already exists" });
      } else {
        res.status(500).json({ success: false, msg: "Something went wrong. Please try again." });
      }
    }
  };
  

  export const importTeacherCsv = async (req, res) => {
    try {
        const teacherData = [];
        const jsonArray = await csvtojson().fromFile(req.file.path);
        
        // Wait for subjects query to complete and store results
        const subjects = await Subject.find({});
        
        // Process each teacher row
        for (const user of jsonArray) {
            // Split the subjects string into an array of IDs
            const subjectIds = user.subjects.split(',').map(id => id.trim());
            
            // Validate that all subject IDs exist in the database
            const validSubjects = subjectIds.filter(id => 
                subjects.some(subject => subject._id.toString() === id)
            );
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const newTeacher = {
                teacher_name: user.teacher_name,
                email: user.email,
                password: hashedPassword,
                mobile: user.mobile,
                subjects: validSubjects,
            };
            
            teacherData.push(newTeacher);
        }
        
        // Insert all teachers at once
        const importedTeachers = await Teacher.insertMany(teacherData);
        
        // Create folders for each imported teacher
        for (const teacher of importedTeachers) {
            try {
                // Get subject names for the teacher's subject IDs
                const teacherSubjects = await Subject.find({
                    _id: { $in: teacher.subjects }
                });
                
                const subjectNames = teacherSubjects.map(subject => subject.name);
                
                // Create folders for the teacher
                await createTeacherFolder(teacher, subjectNames);
                
            } catch (folderError) {
                console.error(`Error creating folders for teacher ${teacher.teacher_name}:`, folderError);
                // Continue with next teacher even if folder creation fails for one
            }
        }
        
        res.status(200).json({
            success: true,
            msg: 'Teachers imported and folders created successfully',
            teachersImported: importedTeachers.length
        });
        
    } catch (error) {
        console.error('Error in import process:', error);
        res.status(400).json({
            success: false,
            msg: 'Failed to import teachers',
            error: error.message
        });
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

