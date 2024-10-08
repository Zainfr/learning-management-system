import React from "react";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { useNavigate, useParams } from "react-router-dom";
import Assigmnment from "../../assets/book1.webp";
import Assigmnment2 from "../../assets/boo2.webp";

const StudentDashboard = () => {
  const [rollNo, setRollNo] = useState("");

  const header1 = <img src={Assigmnment} alt="ass" />;
  const header2 = <img src={Assigmnment2} alt="ass" />;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/student/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRollNo(data.student?.rollno);
      } catch (error) {
        console.error("Error fetching Student:", error);
      }
    };

    fetchStudent();
  }, []);

  const handleClick1 = () => {
    navigate(`/student/${id}/assignments`);
  };

  const handleClick2 = () => {
    navigate(`/student/${id}/upload/${rollNo}`);
  };
  return (
    <div>
      <Header user="Student" />
      <div className="flex">
        <div className="flex">
          <Card
            title="Assignments"
            subTitle="View Assignments"
            onClick={handleClick1}
            header={header1}
            className="w-80 h-fit hover:cursor-pointer transition-all duration-300 ease-in-out hover:p-2 my-8 ml-8 mr4"
          ></Card>
        </div>
        <div className="flex">
          <Card
            title="Experiments"
            subTitle="Upload files"
            onClick={handleClick2}
            header={header2}
            className="w-80 h-fit hover:cursor-pointer transition-all duration-300 ease-in-out hover:p-2 my-8 ml-8 mr4"
          ></Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
