import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";

const ViewExperiments = () => {
    const [experiments, setExperiments] = useState([]);
    const [error, setError] = useState(null);
    const { rollno } = useParams();

    useEffect(() => {
        const fetchExperiments = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/drive/experiments/${rollno}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setExperiments(data.experiments || []);
            } catch (error) {
                console.error("Error fetching Experiments:", error);
                setError("Failed to fetch experiments. Please try again later.");
            }
        };

        fetchExperiments();
    }, [rollno]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Header title={`Experiments for Roll No: ${rollno}`} />
            <div className="experiments-list">
                {experiments.length === 0 ? (
                    <p>No experiments uploaded yet.</p>
                ) : (
                    experiments.map((experiment) => (
                        <div key={experiment._id} className="experiment-item">
                            <h3>{experiment.subject_name}</h3>
                            <p>
                                <strong>File Path:</strong> 
                                <a 
                                    href={`http://localhost:3001${experiment.filePath}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {experiment.filePath}
                                </a>
                            </p>
                            {/* Display the file in a more user-friendly way */}
                            <button 
                                onClick={() => handleFileView(experiment.filePath)}
                            >
                                View File
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Function to handle file viewing
const handleFileView = (filePath) => {
    window.open(`http://localhost:3001${filePath}`, '_blank');
};

export default ViewExperiments;
