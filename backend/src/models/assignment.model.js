import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true
  },
  filePath: String,
  fileName: String,
  submissionDate: { type: Date, default: Date.now },
});

const assignmentSchema = new mongoose.Schema({
  subjectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject' 
},
  teacher: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher',
    required: true
},

  title: {
    type: String,
    required: true
},
  description: String,
  
  dueDate: Date,

studentSubmissions: [submissionSchema],
  }, {
    timestamps: true
  });

export const Assignment = mongoose.model("Assignment", assignmentSchema);