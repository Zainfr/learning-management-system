import { Teacher } from "../models/teacher.models.js";

export const assignMenteesToTeacher = async (teacherId, studentId) => {
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { $addToSet: { mentees: studentId } },  // Adds new student
            { new: true }
        ).populate('mentees');

        if (!updatedTeacher) {
            throw new Error("Teacher not found");
        }

        return updatedTeacher;
    } catch (error) {
        throw new Error(error.message);  // Pass the error up to be handled by the caller
    }
};
