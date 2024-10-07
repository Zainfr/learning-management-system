import { Assignment } from '../models/assignment.model.js';
import path from 'path';
import fs from 'fs';
import { format } from 'date-fns';

//Create assignment
export const createAssignment = async (req, res) => {
    const { subjectId, teacher, title, description, dueDate } = req.body;
  
    if (!title) {
      return res.status(400).json({ message: 'Assignment title is required' });
    }
  
    try {
      // If dueDate is not provided, set it to 7 days from now
      const parsedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
      if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ message: 'Invalid due date format' });
      }
  
      const newAssignment = new Assignment({
        subjectId,
        teacher,
        title,
        description,
        dueDate: parsedDueDate,
        studentSubmissions: []
      });
  
      await newAssignment.save();
      res.status(201).json({ 
        message: 'Assignment created successfully', 
        assignmentId: newAssignment._id,
        teacher: newAssignment.teacher,
        title: newAssignment.title,
        dueDate: parsedDueDate
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating assignment', error: error.toString() });
    }
  };

//Upload student assignment
export const submitAssignment = async (req, res) => {
  const { rollNo } = req.body;
  const { assignmentId } = req.params;
  const assignmentFile = req.file;

  if (!assignmentFile) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  if (!rollNo) {
    return res.status(400).json({ message: 'Roll number is required' });
  }

  try {
    let assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'assignments', assignmentId);
    fs.mkdirSync(uploadDir, { recursive: true });

    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const fileName = `${rollNo}_${timestamp}_${assignmentFile.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    fs.renameSync(assignmentFile.path, filePath);

    // Create a new submission object
    const newSubmission = {
      rollNo: rollNo,
      filePath: filePath,
      fileName: fileName,
      submissionDate: new Date(),
    };

    // Add the new submission to the studentSubmissions array
    assignment.studentSubmissions.push(newSubmission);

    // Save the updated assignment
    await assignment.save();

    res.status(200).json({ 
      message: 'Assignment submitted successfully',
      fileName: fileName
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    }
    res.status(500).json({ message: 'Error submitting assignment', error: error.toString() });
  }
};

// Get all submissions
export const getSubmissions = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(assignment.studentSubmissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error });
  }
};

// Get all assignments
export const getAllAssignments = async (req, res) => {
  try {

    const assignments = await Assignment.find({}, 'subjectId teacher title description dueDate');

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: 'No assignments found' });
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.toString() });
  }
};

// Get one assignments
export const getOneAssignment = async (req, res) => {
  
  const { assignmentId } = req.params;
  try {
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
  
      res.status(200).json(assignment);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching Assignment', error });
    }
};


// Placeholder for future authentication
export const authMiddleware = (req, res, next) => {
  next();
};
  
