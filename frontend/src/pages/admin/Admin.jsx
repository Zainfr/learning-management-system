import { Routes, Route } from "react-router-dom"
import CreateStudent from './CreateStudent'
import CreateTeacher from './CreateTeacher'
import CreateCourse from './CreateCourse'
import AdminDashboard from './AdminDashboard'

const Admin = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/createStudent" element={<CreateStudent />} />
            <Route path="/createTeacher" element={<CreateTeacher />} />
            <Route path="/createCourse" element={<CreateCourse />} />
        </Routes>
    )
}

export default Admin