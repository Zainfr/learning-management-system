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
        return <div className="text-center text-red-500 mt-4">{error}</div>;
    }

    return (
        <div>
            <Header user="Student" />
            <div className="min-h-screen bg-gray-300 p-6">

                {experiments.length === 0 ? (
                    <p className="text-center text-lg font-semibold text-gray-700">
                        No experiments uploaded yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {experiments.map((experiment) => (
                            <div
                                key={experiment._id}
                                className="experiment-item bg-gradient-to-b from-blue-50 to-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                                    {experiment.subject_name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    {/* <strong>File Path:</strong> */}
                                    <a
                                        href={`http://localhost:3001${experiment.filePath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 transition-colors"
                                    >
                                    </a>
                                </p>
                                <button
                                    onClick={() => handleFileView(experiment.filePath)}
                                    className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 transition-all duration-300"
                                >
                                    View File
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Function to handle file viewing
const handleFileView = (filePath) => {
    console.log(filePath)
    window.open(`http://localhost:3001${filePath}`, '_blank');
};

export default ViewExperiments;
