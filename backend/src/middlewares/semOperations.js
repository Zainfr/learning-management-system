import { Semester } from "../models/sem.model.js";
import { Subject } from "../models/subjects.model.js";
import { Student } from "../models/student.model.js";
import { createStudentFolders } from "../controllers/folderController.js";

export async function createSemester(){
  try {
    
    //Creates Subject For Semester 4
    const sem4 = [
      {name:"Analysis of Algorithms",code:"AOA",semester : 4},
      {name:"Database Management System",code:"DBMS",semester : 4},
      {name:"Engineering Mathematics 4",code:"M4",semester : 4},
      {name:"Microprocessors",code:"MP",semester : 4},
    ]
    
    //Creates Subject For Semester 5
    const sem5 = [
      {name:"Computer Networks",code:"CN",semester : 5},
      {name:"Software Engineering",code:"SE",semester : 5},
      {name:"Theorectical Computer Science",code:"TCS",semester : 5},
      {name:"Data Warehouse and Mining",code:"DWM",semester : 5}, 
    ]

    //checks if subject exists
    async function findOrCreateSubject(subject){

      let existingSubject = await Subject.findOne({code : subject.code});

      if(!existingSubject){
        const semDoc = await Semester.findOne({semester : subject.semester});
        if(semDoc) {
          subject.semester = semDoc._id
        } else {
          const newSem = await Semester.create({semester:subject.semester, subjects :[]})
          subject.semester = newSem._id;
        }

        existingSubject = await Subject.create(subject);
      }
      return existingSubject;
    }

    const sem4Doc = await Promise.all(
      sem4.map(findOrCreateSubject)
    );

    const sem5Doc = await Promise.all(
      sem5.map(findOrCreateSubject)
    );
    
    await Semester.findOneAndUpdate(
      {semester : 4},
      {semester : 4, subjects :sem4Doc.map(subject => subject._id)},
      {upsert : true, new : true}
    )

    await Semester.findOneAndUpdate(
      {semester : 5},
      {semester : 5 , subjects : sem5Doc.map(subject => subject._id)},
      {upsert : true, new : true}
    )

    console.log("Semster created/Updated Succesfully");
  } catch (error) {
    console.error("Error Creating Semester",error);
  }
}

// export async function assignSubjectsToStudent(studentId,semester){
//   try {
//     const student = await Student.findById(studentId);
//     const subject = await Subject.find({semester : student.sem});

//     await createStudentFolders(student,subject);
//   } catch (error) {
//     console.log("Error Assigning Subjects to Student",error);
//   }
// }