import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
    mentees : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Student",
    }],
    subjects : [{
        type : mongoose.Schema.ObjectId,
        ref : "Subjects",
    }]
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
