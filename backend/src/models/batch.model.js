import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    batchNo : {
        type : Number,
        required : true,
    },
    department : {
        type : String,
        required : false,
    },
    semester : {
        type  : mongoose.Schema.Types.ObjectId,
        ref : "Semester",
        required : true,
    }
},{ timestamps: true });

export const Batch = mongoose.model("Batch", batchSchema);