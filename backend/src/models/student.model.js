import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const experimentSchema = new mongoose.Schema({
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

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    rollno: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: false,
    },
    sem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester",
        required: true,
        unique: false,
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
        unique: false,
    },
    experiments: [experimentSchema],
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: false,
        unique: false,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

studentSchema.pre("save", async function(next) {

    // Check if the password field is modified
    if (!this.isModified("password")) return next();
    
    // Hash the password with a salt factor of 10
    this.password = await bcrypt.hash(this.password, 10)
    next();
});

studentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const Student = mongoose.model("Student", studentSchema);