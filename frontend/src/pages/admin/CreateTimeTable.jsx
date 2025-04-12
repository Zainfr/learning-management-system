import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import SideBar from '../../components/SideBar';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateTimeTable = () => {
    const [subjects, setSubjects] = useState([]);
    const [batches, setBatches] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [timeTable, setTimeTable] = useState({});
    const department = "CO";

    const timeSlots = [
        "9:15 AM-10:15 AM", "10:15 AM-11:15 AM", "11:15 AM-12:15 PM",
        "12:15 PM-1:15 PM", "1:15 PM-2:15 PM", "2:15 PM-3:15 PM",
        "3:15 PM-4:15 PM", "4:15 PM-5:15 PM"
    ];

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const lectureTypes = [
        { label: 'Lecture', value: 'Lecture' },
        { label: 'Lab', value: 'Lab' },
        { label: 'Tutorial', value: 'Tutorial' }
    ];

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchSemesters(),
                    fetchTeachers(),
                    fetchSubjects()
                ]);
            } catch (err) {
                setError("Failed to load required data. Please refresh the page.");
                console.error("Error loading data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch batches when semester changes
    useEffect(() => {
        if (selectedSemester) {
            fetchBatches(selectedSemester);
        }
    }, [selectedSemester]);

    const fetchTeachers = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/teachers`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setTeachers(data.map(teacher => ({
                value: teacher._id,
                label: teacher.teacher_name
            })));
        } catch (error) {
            console.error("Error fetching teachers", error);
            throw error;
        }
    };

    const fetchSemesters = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/semesters");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                const formattedSemesters = data.map(sem => ({
                    value: sem._id,
                    label: `Semester ${sem.semesterNo}`
                }));
                setSemesters(formattedSemesters);
                setSelectedSemester(formattedSemesters[0].value);
            }
        } catch (error) {
            console.error("Error fetching semesters", error);
            throw error;
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/subjects");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                setSubjects(data.map(subject => ({
                    value: subject.id,
                    label: `${subject.code} - ${subject.name || 'Unknown'}`
                })));
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
            throw error;
        }
    };

    const fetchBatches = async (semesterId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/lms/get-batches/${department}/${semesterId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                setBatches(data.map(batch => ({
                    value: batch._id,
                    label: `Batch ${batch.batchNo}`
                })));
            }
        } catch (error) {
            console.error("Error fetching batches:", error);
            setError("Failed to fetch batches. Please try again later.");
        }
    };

    const handleSlotClick = (day, time) => {
        setSelectedSlot({ day, time });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const date = formData.get('date');
        const startTimeRaw = selectedSlot.time.split('-')[0].trim();

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

        const lectureData = {
            lecture_name: formData.get('subject'),
            lecture_type: formData.get('type'),
            batch: selectedBatch,
            datetime: istDate.toISOString(),
            teacher: formData.get('teacher'),
        };

        try {
            const response = await fetch('http://localhost:3001/api/lms/create-lecture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lectureData)
            });

            const data = await response.json();

            if (data.success) {
                setTimeTable(prev => ({
                    ...prev,
                    [`${selectedSlot.day}-${selectedSlot.time}`]: {
                        ...lectureData,
                        subject: subjects.find(s => s.value === lectureData.lecture_name)?.label
                    }
                }));
                toast.success('Lecture added successfully!');
            } else {
                toast.error(data.message || 'Error creating lecture');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to create lecture');
        }
    };

    if (isLoading) {
        return (
            <div className="flex">
                <div className="fixed z-20 h-screen w-64 md:block">
                    <SideBar />
                </div>
                <div className="flex-grow md:ml-64 p-6 flex items-center justify-center h-screen">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading timetable data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="fixed z-20 h-screen w-64 md:block">
                <SideBar />
            </div>

            <div className="flex-grow md:ml-64 p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Timetable Management</h1>
                    <p className="text-gray-600 mt-2">Create and manage lecture schedules for all batches</p>
                </div>

                {/* Controls and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                            <select
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedSemester || ''}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                            >
                                {semesters.map(sem => (
                                    <option key={sem.value} value={sem.value}>
                                        {sem.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Time Table Grid */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-lg text-gray-800">Weekly Schedule</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time/Day
                                    </th>
                                    {weekDays.map(day => (
                                        <th key={day} className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {timeSlots.map((time, idx) => (
                                    <tr key={time} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                            {time}
                                        </td>
                                        {weekDays.map(day => {
                                            const slotKey = `${day}-${time}`;
                                            const slotData = timeTable[slotKey];

                                            return (
                                                <td
                                                    key={slotKey}
                                                    className={`py-2 px-4 text-sm cursor-pointer transition-colors duration-150 ${slotData ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-100'
                                                        } ${selectedSlot && selectedSlot.day === day && selectedSlot.time === time
                                                            ? 'ring-2 ring-blue-500'
                                                            : ''
                                                        }`}
                                                    onClick={() => handleSlotClick(day, time)}
                                                >
                                                    {slotData ? (
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{slotData.subject}</span>
                                                            <span className="text-xs text-gray-500">
                                                                {slotData.lecture_name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="h-10 flex items-center justify-center text-gray-400">
                                                            <span className="text-xs">+ Add</span>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Slot Form */}
                {selectedSlot && (
                    <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-blue-500">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Add Lecture: <span className="text-blue-600">{selectedSlot.day}, {selectedSlot.time}</span>
                            </h2>
                            <button
                                onClick={() => setSelectedSlot(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <select
                                        name="subject"
                                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select a subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject.value} value={subject.value}>
                                                {subject.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                                    <select
                                        name="teacher"
                                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select a teacher</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.value} value={teacher.value}>
                                                {teacher.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Lecture Type</label>
                                    <select
                                        name="type"
                                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        {lectureTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                                    <div className="w-full">
                                        <MultiSelect
                                            value={selectedBatch}
                                            onChange={(e) => setSelectedBatch(e.value)}
                                            options={batches}
                                            optionLabel="label"
                                            display="chip"
                                            placeholder="Select Batch(es)"
                                            maxSelectedLabels={3}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar size={16} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            name="date"
                                            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSlot(null)}
                                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add to Timetable
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateTimeTable;