import mongoose,{Schema} from "mongoose";

const attendanceSchema = new Schema({
    lecture : {
        type : Schema.Types.ObjectId,
        ref : "Lecture",
        required : true
    },
    student : {
        type : Schema.Types.ObjectId,
        ref : "Student",
        required : true,
    },
    status : {
        type : String,
        enum : ["Present","Absent"],
        required : true,
    },
    markedby : {
        type : Schema.Types.ObjectId,
        ref : "Teacher",
        required : true,
    }
},{ timestamps: true });


export const Attendance = mongoose.model("Attendance",attendanceSchema);