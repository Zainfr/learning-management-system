import React, { useEffect, useState } from 'react';


const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const response = await fetch('http://localhost:3001/api/announcements');
            const data = await response.json();
            setAnnouncements(data);
        };

        fetchAnnouncements();
    }, []);

    return (
        <div>
            <h1>Announcements</h1>
            <ul>
                {announcements.map(announcement => (
                    <li key={announcement.id}>{announcement.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default AnnouncementsPage;
