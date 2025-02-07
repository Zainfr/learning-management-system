import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const studyMaterialSchema = new mongoose.Schema({
    subject_name: {
        type: String,  // Change this to String instead of ObjectId
        required: true,
    },
    folder_path: {
        type: String,
        required: false,
    },
    filePath: {
        type: String,
        required: false,
    }
}, { timestamps: true })

const teacherSchema = new mongoose.Schema({
    teacher_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    subjects : [{
        type : mongoose.Schema.ObjectId,
        ref : "Subject",
    }],
    study_material :[studyMaterialSchema],
    mentees : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Student",
    }],
},{timestamps: true});

teacherSchema.pre("save", async function(next) {

    // Check if the password field is modified
    if(!this.isModified("password")) return next();
    
    // Hash the password with a salt factor of 10
    this.password = await bcrypt.hash(this.password, 10)
    next();
});
    
teacherSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const Teacher = mongoose.model("Teacher", teacherSchema);
