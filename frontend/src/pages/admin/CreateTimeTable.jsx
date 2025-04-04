import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SideBar from '../../components/SideBar'

const CreateTimeTable = () => {
    const [subjects, setSubjects] = useState([]);
    const [batches, setBatches] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const timeSlots = [
        "9:15 AM-10:15 AM", "10:15 AM-11:15 AM", "11:15 AM-12:15 PM",
        "12:15 PM-1:15 PM", "1:15 PM-2:15 PM", "2:15 PM-3:15 PM",
        "3:15 PM-4:15 PM", "4:15 PM-5:15 PM"
    ];

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const [timeTable, setTimeTable] = useState({});

    // Fetch subjects and batches from backend
    useEffect(() => {
        // Add your API calls here
        // fetchSubjects();
        // fetchBatches();
    }, []);

    const handleSlotClick = (day, time) => {
        setSelectedSlot({ day, time });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            subject: e.target.subject.value,
            type: e.target.type.value,
            batch: e.target.batch.value,
            date: e.target.date.value,
            teacher: e.target.teacher.value,
            day: selectedSlot.day,
            time: selectedSlot.time
        };

        // If lab is selected, check if next slot is available
        if (formData.type === 'Lab') {
            // Add validation for 2-hour slot availability
        }

        setTimeTable(prev => ({
            ...prev,
            [`${selectedSlot.day}-${selectedSlot.time}`]: formData
        }));

        // Add API call to save to backend
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
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Teacher</label>
                                <select name="teacher" className="border p-2 w-full rounded" required>
                                    {teachers.map(subject => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
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
                                    {batches.map(batch => (
                                        <option key={batch.id} value={batch.id}>
                                            {batch.name}
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