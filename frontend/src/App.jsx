import { Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Admin from './pages/admin/Admin'
import Student from './pages/student/Student'
import Teacher from './pages/teacher/Teacher'


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/student/*" element={<Student />} />
      <Route path="/teacher/*" element={<Teacher />} />
    </Routes>
  )
}

export default App