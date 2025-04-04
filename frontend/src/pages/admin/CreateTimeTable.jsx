import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SideBar from '../../components/SideBar'

const CreateTimeTable = () => {
    const [subjects, setSubjects] = useState([]);
    const [batches, setBatches] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [error, setError] = useState(null);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const department = "CO";

    const timeSlots = [
        "9:15 AM-10:15 AM", "10:15 AM-11:15 AM", "11:15 AM-12:15 PM",
        "12:15 PM-1:15 PM", "1:15 PM-2:15 PM", "2:15 PM-3:15 PM",
        "3:15 PM-4:15 PM", "4:15 PM-5:15 PM"
    ];

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const [timeTable, setTimeTable] = useState({});

    // Fetch subjects, teachers and batches from backend
    const fetchTeachers = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/teachers`);
            const data = await response.json();
            setTeachers(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching teachers", error);
        }
    };
    const fetchSemesters = async () => {
        try {
            const semestersResponse = await fetch(
                "http://localhost:3001/api/semesters"
            );

            const semestersData = await semestersResponse.json();
            if (Array.isArray(semestersData)) {
                setSemesters(semestersData);
                console.log(semestersData);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error("Error fetching Semesters", error);
        }
    };
    const fetchSubjects = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/subjects");
            if (!response.ok) {
                console.error(error);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (Array.isArray(data)) {
                setSubjects(data);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error("Error fetching Subjects:", error);
            setError("Failed to fetch Subjects. Please try again later.");
        }
    };

    const fetchBatches = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/lms/get-batches/${department}/${semesters[0]?._id}`);
            if (!response.ok) {
                console.error(error);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (Array.isArray(data)) {
                setBatches(data);
            } else {
                throw new Error("Unexpected response format");
            }
        }
        catch (error) {
            console.error("Error fetching Batches:", error);
            setError("Failed to fetch Batches. Please try again later.");
        }
    };

    useEffect(() => {
        fetchSemesters();
        fetchTeachers();
        fetchSubjects();
        fetchBatches();
    }, []);

    const handleSlotClick = (day, time) => {
        setSelectedSlot({ day, time });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const date = e.target.date.value; // e.g. "2025-04-04"
        const startTimeRaw = selectedSlot.time.split('-')[0].trim(); // e.g. "9:15 AM"

        const [time, modifier] = startTimeRaw.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        // Manually create a UTC Date based on IST
        const istDate = new Date(date);
        istDate.setUTCHours(hours - 5); // IST is UTC+5:30
        istDate.setUTCMinutes(minutes - 30);
        istDate.setUTCSeconds(0);
        istDate.setUTCMilliseconds(0);

        const formData = {
            lecture_name: e.target.subject.value,
            lecture_type: e.target.type.value,
            batch: e.target.batch.value,
            datetime: istDate.toISOString(), // Correct UTC time representing 9:15 IST
            teacher: e.target.teacher.value,
        };

        try {
            const response = await fetch('http://localhost:3001/api/lms/create-lecture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setTimeTable(prev => ({
                    ...prev,
                    [`${selectedSlot.day}-${selectedSlot.time}`]: formData
                }));
                alert('Lecture created successfully');
            } else {
                alert(data.message || 'Error creating lecture');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create lecture');
        }
    };



    return (
        <div className="flex">
            <div className="fixed z-20 h-screen w-64 md:block">
                <SideBar />
            </div>

            <div className="flex-grow md:ml-64 p-6">
                <h1 className="text-2xl font-bold mb-4">Create Time Table</h1>

                {/* Time Table Grid */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="border p-2">Time/Day</th>
                                {weekDays.map(day => (
                                    <th key={day} className="border p-2">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map(time => (
                                <tr key={time}>
                                    <td className="border p-2">{time}</td>
                                    {weekDays.map(day => (
                                        <td
                                            key={`${day}-${time}`}
                                            className="border p-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSlotClick(day, time)}
                                        >
                                            {timeTable[`${day}-${time}`]?.subject || ''}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Slot Form */}
                {selectedSlot && (
                    <form onSubmit={handleSubmit} className="mt-4 bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">
                            Add Lecture for {selectedSlot.day} at {selectedSlot.time}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Subject</label>
                                <select name="subject" className="border p-2 w-full rounded" required>
                                    {subjects.map(subject => (
                                        <option key={subject._id} value={subject.id}>
                                            {subject.code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Teacher</label>
                                <select name="teacher" className="border p-2 w-full rounded" required>
                                    {teachers.map(subject => (
                                        <option key={subject._id} value={subject._id}>
                                            {subject.teacher_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Type</label>
                                <select name="type" className="border p-2 w-full rounded" required>
                                    <option value="Lecture">Lecture</option>
                                    <option value="Lab">Lab</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Batch</label>
                                <select name="batch" className="border p-2 w-full rounded" required>
                                    {batches.map((batch) => (
                                        <option key={batch.batchNo} value={batch._id}>
                                            {batch.batchNo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Date</label>
                                <input type="date" name="date" className="border p-2 w-full rounded" required />
                            </div>
                        </div>
                        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Add to Time Table
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateTimeTable;