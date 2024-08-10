import csvtojson from "csvtojson";
import { Admin } from "../models/admin.model.js";

const importUser = async (req, res) => {
    try {
        const userData = [];

        // Parse CSV file to JSON
        const jsonArray = await csvtojson().fromFile(req.file.path);

        // Prepare user data for insertion
        jsonArray.forEach((user) => {
            userData.push({
                name: user.name,
                email: user.email,
                mobile: user.mobile, // Ensure the CSV headers match these keys
            });
        });

        // Insert user data into the database
        await Admin.insertMany(userData);

        res.send({ status: 200, success: true, msg: "CSV IMPORTED" });
    } catch (error) {
        res.status(400).send({ status: 400, success: false, msg: error.message });
    }
};

export default importUser;
