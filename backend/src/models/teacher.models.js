import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
    {
        name: {
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
        }

    }, 
    
    {timestamps: true}
)

export const Teacher = mongoose.model("Teacher", teacherSchema);
