import React, { useEffect, useState } from 'react';

const AssignmentsPage = () => {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const fetchAssignments = async () => {
            const response = await fetch('http://localhost:3001/api/assignments');
            const data = await response.json();
            setAssignments(data);
        };

        fetchAssignments();
    }, []);

    return (
        <div>
            <h1>Assignments</h1>
            <ul>
                {assignments.map(assignment => (
                    <li key={assignment.id}>{assignment.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default AssignmentsPage;
