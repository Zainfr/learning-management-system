import { Routes, Route } from 'react-router-dom';
import AssignmentsPage from '../../pages/student/AssignmentsPage';
import AnnouncementsPage from '../../pages/student/AnnouncementsPage';
import ToDoList from '../../pages/student/ToDoList';
import FolderSystem from '../../pages/student/FolderSystem';
import StudentDashboard from './StudentDashboard';

const Student = () => {
    return (
        <Routes>
            <Route path="/students/:id" element={<StudentDashboard />} />
            <Route path="/students/:id/assignments" element={<AssignmentsPage />} />
            <Route path="/students/:id/announcements" element={<AnnouncementsPage />} />
            <Route path="/students/:id/todo" element={<ToDoList />} />
            <Route path="/students/:id/folder" element={<FolderSystem />} />
        </Routes>
    )
}

export default Student