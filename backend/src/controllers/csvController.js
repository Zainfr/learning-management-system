import csvtojson from "csvtojson";
import { Student } from "../models/student.model.js";

const importUserCsv = async (req, res) => {
    try {
        const userData = [];

        // Parse CSV file to JSON
        const jsonArray = await csvtojson().fromFile(req.file.path);

        // Prepare user data for insertion
        jsonArray.forEach((user) => {
            userData.push({
                name: user.name,
                email: user.email,
                password : user.password,
                mobile: user.mobile, // Ensure the CSV headers match these keys
            });
        });

        // Insert user data into the database
        await Student.insertMany(userData);

        res.send({ status: 200, success: true, msg: "CSV IMPORTED" });
    } catch (error) {
        res.status(400).send({ status: 400, success: false, msg: error.message });
    }
};

export default importUserCsv;